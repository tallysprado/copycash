from sqlalchemy import DateTime,Boolean, String, Integer, Column, Text
from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_cors import CORS
from flask_praetorian import Praetorian
import os
import datetime

app = Flask(__name__)
guard = Praetorian()
db = SQLAlchemy()
cors = CORS()


app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tallys:teste123@localhost:5432/longdb'
app.config['SECRET_KEY'] = '_5#y2L"F4Q8z\xec]/'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 1}
app.config['JWT_REFRESH_LIFESPAN'] = {'days':1}

class Users(db.Model):
    __tablename__='users'
    id = Column(Integer, primary_key=True)
    username = Column(Text, unique=True)
    password = Column(Text)
    roles = Column(Text)
    conta_id = Column(Integer, db.ForeignKey('conta.id'))
    conta = db.relationship('Conta', backref='conta')
    is_active = Column(Boolean, default=True, server_default='true')

    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active


    def __repr__(self):
        return f'Users {self.username}'

class Conta(db.Model):
    __tablename__ = 'conta'
    id = Column(Integer, primary_key=True)
    email = Column(String(50))
    senha = Column(String(20))
    operacao = db.relationship('Operacao', backref='conta')
    
    def __init__(self,email, senha):
        self.email = email
        self.senha = senha
    def __repr__(self):
        return "<Conta (email='{}', senha='{}')>".format(self.email, self.senha)
    
class Operacao(db.Model):
    __tablename__ = 'operacao'
    id = Column(Integer, primary_key=True)
    valor = Column(Integer, default=5)
    nivel = Column(Integer, default='0')
    conta_id = Column(Integer, db.ForeignKey('conta.id'))

class Operacoes(db.Model):
    __tablename__ = 'operacoes'
    id = Column(Integer, primary_key=True)
    data = Column(DateTime, default=datetime.datetime.utcnow)
    direcao = Column(String(5), default='BAIXO')
    paridade = Column(String(10))
    expiracao = Column(Integer)
    resultado = Column(String(4))
    tipo = Column(String(8))
    operation_id = Column(Integer)


db.init_app(app)
guard.init_app(app, Users)
cors.init_app(app)


with app.app_context():
        db.create_all()

        if db.session.query(Users).filter_by(username='tallys.prado').count()<1:
            db.session.add(Users(
                username='tallys.prado',
                password=guard.hash_password('teste'),
                roles='user'
            ))
            db.session.add(Users(
                username='user2',
                password=guard.hash_password('teste'),
                roles='admin'
            ))
            db.session.commit()


