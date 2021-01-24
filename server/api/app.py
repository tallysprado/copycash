from flask import Flask, request, jsonify
from API import API
import os
from flask_cors import CORS
from db import Users, Conta, Operacao
from flask_sqlalchemy import SQLAlchemy
import flask_praetorian
import time
from iqoptionapi.stable_api import IQ_Option
from multiprocessing import Process

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tallys:teste123@localhost:5432/longdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days':30}
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'

cors = CORS(app, resources={r"/*": {"origins": "http://localhost:5000"}})
guard = flask_praetorian.Praetorian()
cors.init_app(app)
db = SQLAlchemy()

guard.init_app(app,Users)
db.init_app(app)


#cors = CORS(app, resources={r"/api/login": {"origins": "http://localhost:5000"}})

def buy_thread(email, senha, paridade, tipo, expiracao, action):
    print('thread')
    conta = IQ_Option(email, senha)
    conta.connect()
    conta.change_balance("PRACTICE")
    check, id = conta.buy(10, paridade, action, expiracao)
    if (check):
        print(check)
        return
    else:
        return 0


@app.route("/buy", methods=['POST'])
def buy():
    data = request.get_json()
    paridade = data['paridade']
    tipo = data['tipo']
    expiracao = int(data['expiracao'])
    action = 'call' if data['direcao']=='CIMA' else 'put'

    contas = Conta.query.all()
    pool = []
    for conta in contas:
        p = Process(target=buy_thread, args=(conta.email, conta.senha, paridade, tipo, expiracao, action))
        pool.append(p)
    for p in pool:
        print(p)
        p.start()
        
    return {'Resultado':'Comprado!'}

@app.route("/api/login", methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
def login():
    data = request.get_json(force=True)
    username=data.get('username', None)
    password = data.get('password',None)
    print(username, password)
    users = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(users)}

    return ret,200
@app.route("/api/refresh", methods=['POST'])
def refresh():
    print("refresh request")
    old_token = request.get_data()
    new_token = guard.refresh_jwt_token(old_token)
    ret = {'access_token': new_token}

    return ret,200
@app.route('/api/protected')
@flask_praetorian.auth_required
def protected():
    """
    A protected endpoint. The auth_required decorator will require a header
    containing a valid JWT
    .. example::
       $ curl http://localhost:5000/api/protected -X GET \
         -H "Authorization: Bearer <your_token>"
    """
    return {message: f'protected endpoint (allowed user {flask_praetorian.current_user().username})'}
@app.route("/info", methods=['POST'])
def info():
    data = request.get_json()
@app.route("/paridades")
def paridades():
    api = API()
    api.connect()
    data = request.get_json()
    print(data)
    binary, digital = api.paridades()
    return {'binary': binary, 'digital': digital}
@app.route("/config", methods=['POST'])
def config():
    data = request.get_json()
    valor = data['valor']
    soros = data['soros']
    email = data['email']
    senha = data['senha']
    ret = False
    new_acc = Conta(email=email, senha=senha)
    new_op = Operacao(valor=int(valor), nivel=soros)
    new_acc.operacao.append(new_op)
    if db.session.query(Conta).filter_by(email=email).count()<1:

        db.session.add(new_acc)
        ret = True
        db.session.commit()
    if db.session.query(Conta).filter_by(email=email).count()>=1:
        ret = True
        conta = Conta.query.filter_by(email=email).first()
        print(conta)
        conta.senha = senha
        db.session.commit()

    

    print(valor, soros, email, senha)

    return {'result': ret}


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=os.getenv("DEBUG"), port=5001)
