from flask import Flask, request, jsonify
from API import API
import os
from flask_cors import CORS
from db import Users, Conta, Operacao
from flask_sqlalchemy import SQLAlchemy
import flask_praetorian

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tallys:teste123@localhost:5432/longdb'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'segredo de estado'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days':30}

cors = CORS()
guard = flask_praetorian.Praetorian()
cors.init_app(app)
db = SQLAlchemy()

guard.init_app(app,Users)
db.init_app(app)

CORS(app, resouces={r"/*": {"origins": "*"}})



api = API(email='fokrainsdetrosovisk@gmail.com', senha='Teste123')
api.connect()

@app.route("/api/login", methods=['POST'])
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



@app.route("/paridades")
def paridades():
    data = request.get_json()
    print(data)
    binary, digital = api.paridades()
    return {'binary': binary, 'digital': digital}

@app.route("/buy", methods=['POST'])
def buy():
    data = request.get_json()
    paridade = data['paridade']
    tipo = data['tipo']
    expiracao = data['expiracao']
    direcao = data['direcao']

    print( direcao, tipo, paridade, expiracao)
    
    check = api.buy(paridade,10, direcao, expiracao, tipo)

    return {'Compra': check}

@app.route("/config", methods=['POST'])
def config():
    data = request.get_json()
    valor = data['valor']
    soros = data['soros']
    email = data['email']
    senha = data['senha']
    
    new_acc = Conta(email=email, senha=senha)
    new_op = Operacao(valor=int(valor), nivel=soros)
    new_acc.operacao.append(new_op)
    if db.session.query(Conta).filter_by(email=email).count()<1:

        db.session.add(new_acc)

        db.session.commit()
    if db.session.query(Conta).filter_by(email=email).count()>=1:

        conta = Conta.query.filter_by(email=email).first()
        print(conta)
        conta.senha = senha
        db.session.commit()

    

    print(valor, soros, email, senha)

    return {'Conta': conta}


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=os.getenv("DEBUG"), port=5001)
