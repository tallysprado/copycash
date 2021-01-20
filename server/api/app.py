from flask import Flask, request, jsonify
from API import API
import os
from flask_cors import CORS
app = Flask(__name__)
cors = CORS()
cors.init_app(app)

api = API(email='fokrainsdetrosovisk@gmail.com', senha='Teste123')
api.connect()

@app.route("/paridades")
def paridades():
    data = request.get_json()
    print(data)
    paridades = api.paridades()
    print(paridades)
    return {'paridades': paridades}

@app.route("/buy", methods=['POST'])
def buy():
    data = request.get_json()
    print(data)

    return {"buy-info": 'test'}



if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=os.getenv("DEBUG"), port=5001)
