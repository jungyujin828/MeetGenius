from flask import Blueprint, render_template,url_for,flash,request,session,g
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import redirect

from app import db
from app.forms import UserRegistrationForm,UserLoginForm
from app.models import User


# blueprint 선언.
bp = Blueprint('user', __name__, url_prefix='/user')


@bp.route('/') # 애너테이션으로 URL을 매핑하는 라우팅 함수.
def user_list():
    user_list = User.query.order_by(User.create_date.desc())
    return render_template('user/user_list.html', user_list = user_list)

@bp.route('/detail/<int:user_id>/') # / 안붙여도 에러남 주의
def user_detail(user_id):
    user = User.query.get_or_404(user_id) # 없는 친구들 페이지 생성 안하게
    return render_template('user/user_detail.html', user = user)

@bp.route('/signup', methods = ['GET','POST']) 
def signup():
    form = UserRegistrationForm()
    if request.method =='POST' and form.validate_on_submit():
        error = None
        existing_user = User.query.filter_by(email=form.email.data).first()
        if existing_user:
            flash('이미 존재하는 이메일(유저)입니다.')
            return redirect(url_for('user.signup'))
        # 존재하지 않으면,
        user = User(
            username=form.username.data,
            password=generate_password_hash(form.password.data),  # 비밀번호 해싱처리.
            email=form.email.data,
            age=form.age.data,
            is_agent=form.is_agent.data,
            is_owner=form.is_owner.data,
            is_tenant=form.is_tenant.data
        )
        db.session.add(user)
        db.session.commit()

        flash('가입성공')
        print('가입성공')
        return redirect(url_for('user.user_list'))
    return render_template('user/signup.html', form=form)

@bp.route('/login',methods=['GET','POST'])
def login():
    form = UserLoginForm()
    if request.method =='POST' and form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user is None:
            flash('등록되지 않은 이메일입니다.', 'error')
        elif not check_password_hash(user.password, form.password.data):
            flash('비밀번호가 일치하지 않습니다.', 'error')
        else : 
            session.clear()
            session['user_id'] = user.id
            flash('로그인 성공!', 'success')
            return redirect(url_for('user.user_list'))  # 로그인 후 메인 페이지로 이동
    return render_template('user/login.html', form=form)

# Flash에서 세션을 사용해 혀냊 로그인한 사용자 추적.
@bp.before_app_request # 라우팅 함수보다 항상 먼저 실행됨. (모든 라우팅 함수보다)
def load_logged_in_user():
    # session 변수에 user_id값이 있으면 데이터베이스에서 사용자 정보를 조회하여 g.user에 저장
    # 이렇게 하면 이후 사용자 로그인 검사를 할 때 session을 조사할 필요가 없다. g.user에 값이 있는지만 확인
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None 
    else:
        g.user = User.query.get(user_id)
        

@bp.route('/logout/')
def logout():
    session.clear()
    return redirect(url_for('main.main_page'))
