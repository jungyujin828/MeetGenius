'''
# init 파일을 열고 create_app 함수를 선언하는 방식
- create_app 대신 다른 이름을 사용하면 정상으로 동작하지 않는다. 
    - create_app은 플라스크 내부에서 정의된 함수명
'''

from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
import config

db = SQLAlchemy()
migrate = Migrate()

# create_app : 애플리케이션 팩토리.

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    from . import models

    db.init_app(app)
    migrate.init_app(app, db)

    # veiw 함수 가져옴.
    from .views.main_views import bp as main_bp
    from .views.user_veiws import bp as user_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(user_bp)
    return app
