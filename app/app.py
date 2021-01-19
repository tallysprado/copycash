from flask import Flask, request, jsonify
import flask
from API import API
import flask_sqlalchemy
import flask_cors
from sqlalchemy import String, Integer, Column
from sqlalchemy import create_engine
import flask_praetorian
import os


#APP
app = Flask(__name__)
guard = flask_praetorian.Praetorian()
db = flask_sqlalchemy.SQLAlchemy()
cors = flask_cors.CORS()
#CORS(app, resouces={r"/app/*": {"origins": "*"}})



class Users(db.Model):
    __tablename__='users'
    id = Column(Integer, primary_key=True)
    username = Column(db.Text, unique=True)
    password = Column(db.Text)
    roles = db.Column(db.Text)
    conta_id = db.Column(Integer, db.ForeignKey('conta.id'))
    conta = db.relationship('Conta', backref='conta')
    is_active = db.Column(db.Boolean, default=True, server_default='true')
    
    
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
    
#CLASSE BANCOS
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
    soros = Column(String(3), default='1')
    nivel = Column(Integer, default='2')
    conta_id = Column(Integer, db.ForeignKey('conta.id'))

def add(email, senha, valor, soros, nivel):
    conta = Conta(email=email, senha=senha)
    operacao = Operacao(valor=valor, soros=soros, nivel=nivel)
    conta.operacao.append(operacao)
    db.session.add(conta)
    db.session.add(operacao)
    db.session.commit()

def buy(email, senha, paridade, direcao, expiracao, tipo):
    operacao = API(paridade=paridade, expiracao=expiracao, direcao=direcao, email=email, senha=senha,
                   valor=10)
    operacao.connect()
    operacao.buy()


#setup inicial do banco de dados
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tallys:teste123@localhost:5432/longdb'
app.config['SECRET_KEY'] = '_5#y2L"F4Q8z\xec]/'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days':30}

db.init_app(app)
guard.init_app(app, Users)
cors.init_app(app)

with app.app_context():
    db.create_all()
    if db.session.query(Users).filter_by(username='tallys.prado@gmail.com').count()<1:
        db.session.add(Users(
            username='tallys.prado@gmail.com',
            password=guard.hash_password('teste123')
        ))
        db.session.commit()

#app.secret_key = '_5#y2L"F4Q8z\xec]/'

@app.route('/api/login', methods=['POST'])
def login():
    req = flask.request.get_json(force=True)
    username = req.get('username',None)
    password = req.get('password',None)
    user = guard.authenticate(username,password)
    ret = {'acess_token': guard.encode_jwt_token(user)}
    return ret, 200
@app.route('/api/refresh', methods=['POST'])
def refresh():
    print('refresh request')
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'acess_token': new_token}
    return ret, 200
@app.route('/api/protected')
@flask_praetorian.auth_required
def protected():
    return {message: f'protected endpoint (allowed user {flask_praetorian.current_user().username})'}

#IQ OPTION
def getBalance(conta, email,senha):

    return conta.balance()

def paridades(conta):
    paridades = conta.paridades()
    print(paridades)
    return paridades

def buyAll(paridade, direcao, expiracao, tipo):
    
    db_uri = 'postgresql://tallys:teste123@localhost:5432/longdb'
    engine = create_engine(db_uri)
    result = engine.execute('SELECT * FROM conta').fetchall()
    
    for i in result:
        print(i)
        buy(email=i[1], senha=i[2], paridade=paridade, direcao=direcao, expiracao=expiracao, tipo=tipo)
        

conta = API(paridade="EURUSD", expiracao=15, direcao="put", email="fokrainsdetrosovisk@gmail.com", senha="Teste123",
                   valor=10)
conta.connect()



@app.route('/validate', methods=['POST'])
def validate():
    if request.method =='POST':
        
        data = request.get_json()
        email = data['email']
        print(email)

        user = db.session.query(User).filter_by(email=email).first()
        print(user)

        if user!=None:
            return {'trigger': True}
        else:
            return {'trigger': False}


        

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=os.getenv("DEBUG"), port=5001)
    
    
    
