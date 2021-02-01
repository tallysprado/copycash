from flask import Flask, request, jsonify
from API import API
import os
from flask_cors import CORS
from models import Users, Conta, Operacao, Operacoes
from flask_sqlalchemy import SQLAlchemy
import flask_praetorian
import time
from iqoptionapi.stable_api import IQ_Option
from multiprocessing import Process

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tallys:teste123@localhost:5432/longdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 1}
app.config['JWT_REFRESH_LIFESPAN'] = {'days':1}
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'the quick brown fox jumps over the lazy   dog'

#cors = CORS(app, resources={r"/api/login": {"origins": "http://localhost:5000"}})
#cors.init_app(app)
CORS(app, resources={r"/*": {"origins": "*"}})
guard = flask_praetorian.Praetorian()
db = SQLAlchemy()
guard.init_app(app,Users)
db.init_app(app)
#cors = CORS(app, resources={r"/api/login": {"origins": "http://localhost:5000"}})
def buy_thread(email, senha, paridade, tipo, expiracao, action, valor):
    conta = IQ_Option(email, senha)
    conta.connect()
    conta.change_balance("PRACTICE")
    if (tipo=='BINÁRIA'):
        check, id = conta.buy(valor, paridade, action, expiracao)
        if check:
            check
    if (tipo=='DIGITAL'):
        check, id = conta.buy_digital_spot(paridade, valor, action, expiracao)
        if check:
            check
    print(check, id)
    time.sleep(1)
    return 'error check'

@app.route("/buy", methods=['POST'])
def buy():
    data = request.get_json()
    paridade = data['paridade']
    tipo = data['tipo']
    expiracao = int(data['expiracao'])
    action = 'call' if data['direcao']=='CIMA' else 'put'
    pool = []
    operacoes = Conta.query.join(Operacao,
    Conta.id==Operacao.conta_id)\
    .add_columns(Conta.email, Conta.senha, Operacao.valor,
    Operacao.nivel)\
    .filter(Conta.id == Operacao.id)\
    .filter(Operacao.conta_id == Conta.id)\
    .paginate()
    i = 0
    for items in operacoes.items:
        p = Process(target=buy_thread, args=[
            items.email, items.senha, paridade, tipo, expiracao, action,
            items.valor
        ])
        print(items.email)
        print(i)
        pool.append(p)
        i+=1
    for p in pool:
        p.start()


    '''
    operacao = Operacoes(tipo=tipo,direcao=action, expiracao=expiracao, paridade=paridade)
    db.session.add(operacao)
    db.session.commit()
    '''

    return {'Resultado':str(pool)}
@app.route('/check_win', methods=['GET'])
def check_win():
    conta = IQ_Option("fokrainsdetrosovisk@gmail.com","Teste123")
    conta.connect()
    descending = Operacoes.query.order_by(Operacoes.id.desc())
    last_item = descending.first()
    
    print(last_item.operation_id)

    return {"last_operation": last_item.operation_id}, 200

@app.route("/api/login", methods=['POST'])
#@cors_origin(origin='localhost',headers=['Content- Type','Authorization'])
def login():
    data = request.get_json(force=True)
    username=data.get('username', None)
    password = data.get('password',None)
    print(username, password)
    users = guard.authenticate(username, password)
    ret = {'access_token': guard.encode_jwt_token(users), 'username': username}

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

@app.route('/get_config', methods=['POST', 'GET'])
def get_config():
    data = request.get_json()
    #username = data['username']
    operacoes = Conta.query.join(Operacao,
    Conta.id==Operacao.conta_id)\
        .add_columns(Conta.email, Conta.senha, Operacao.valor,
        Operacao.nivel)\
            .filter(Conta.id == Operacao.id)\
                .filter(Operacao.conta_id == Conta.id)\
                    .paginate()

    users = Users.query.join(Conta, Users.id==Conta.id)\
        .add_columns(Users.username, Conta.email, Conta.senha)\
            .filter(Users.id == Conta.id)\
                .filter(Conta.id==Users.id).paginate()
    
    for item in operacoes.items:
        print(item)
        for user in users.items:
            print(user[1])
    return {'Operações':True}

@app.route("/config", methods=['POST'])
def config():
    data = request.get_json()
    valor = data['valor']
    soros = data['soros']
    email = data['email']
    senha = data['senha']
    user = data['username']
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
        user = Users.query.filter_by(username=user).first()
        user.conta_id = conta.id
        print(conta)
        conta.senha = senha
        db.session.merge(user)
        db.session.merge(conta)
        db.session.commit()
    print(valor, soros, email, senha)

    return {'result': ret}

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=os.getenv("DEBUG"), port=5000)
