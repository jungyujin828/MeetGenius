from app import db
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(200), nullable=False)
    password = db.Column(db.String(200), nullable=False) 
    # password 는 hash로 저장할거임.
        # bcrypt 알고리즘 or argon2 알고리즘 활용.
    email = db.Column(db.String(120), unique=True, nullable=False)
    age = db.Column(db.Integer(), nullable=True)

    is_agent = db.Column(db.Boolean(), default=False)   # 중개사 여부
    is_owner = db.Column(db.Boolean(), default=False)   # 임대인 여부
    is_tenant = db.Column(db.Boolean(), default=False)  # 임차인 여부
    create_date = db.Column(db.DateTime(), nullable=False, default = datetime.utcnow)

    # 역참조 (중개사로 등록된 부동산 목록)
    agent_properties = db.relationship('Property', backref='agent', foreign_keys='Property.agent_id')
    # db.relation('대상테이블',backref='역참조시 속성 이름, foreign_keys='관계 정의할 때 사용할 외래 키)

    # 역참조 (소유자로 등록된 부동산 목록)
    owner_properties = db.relationship('Property', backref='owner', foreign_keys='Property.owner_id')
    # 역참조 (임차인으로 등록된 부동산 목록)
    tenant_properties = db.relationship('Property', backref='tenant', foreign_keys='Property.tenant_id')

class Property(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(255), nullable=False) 
    price = db.Column(db.Float, nullable=False)
    is_for_rent = db.Column(db.Boolean, default=False)  # 임대 여부
    create_date = db.Column(db.DateTime(), nullable=False, default=datetime.utcnow)

    # 중개사와의 관계
    agent_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # 소유자와의 관계
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # 임차인과의 관계 (임대된 경우에만 값이 존재)
    tenant_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)

    
# 여기다 이미지나 영상 데이터도 추가해야 함.
# class x ():
#    pass