from flask import Flask, request, jsonify
from API import API
import os
from flask_cors import CORS


app = Flask(__name__)
cors = CORS()
cors.init_app(app)
CORS(app, resouces={r"/*": {"origins": "*"}})


api = API(email='fokrainsdetrosovisk@gmail.com', senha='Teste123')
api.connect()

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
    
    api.buy(paridade,10, direcao, expiracao, tipo)

    return {"buy-info": 'test'}



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=os.getenv("DEBUG"), port=5001)
