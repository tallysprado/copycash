from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import create_engine

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tallys:teste123@localhost:5432/longdb'
db = SQLAlchemy(app)

class Conta(db.Model):
    __tablename__ = 'conta'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50))
    senha = db.Column(db.String(20))
    operacao = db.relationship('Operacao', backref='conta')
    def __repr__(self):
        return "<Conta (email='{}', senha='{}')>".format(self.email, self.senha)
    
class Operacao(db.Model):
    __tablename__ = 'operacao'
    id = db.Column(db.Integer, primary_key=True)
    valor = db.Column(db.Integer, default=5)
    soros = db.Column(db.String(1))
    nivel = db.Column(db.Integer)
    conta_id = db.Column(db.Integer, db.ForeignKey('conta.id'))