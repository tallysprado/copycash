from iqoptionapi.stable_api import IQ_Option
import time

class API:
    def __init__(self, paridade, valor, expiracao, direcao, email, senha):
        self.paridade = paridade
        self.valor = valor 
        self.senha = senha
        self.expiracao = expiracao
        self.direcao = direcao
        self.email = email
        self.api = None
        
    def connect(self):
        self.api = IQ_Option(self.email, self.senha)
        self.api.connect()
        self.api.change_balance("PRACTICE")
        #print(self.api.check_connection())
    
    def paridades(self):
        assets = self.api.get_all_open_time()
        open = []
        for asset in assets["binary"]:
            if assets["binary"][asset]["open"]:
                open.append(asset)
        return open
    def setValor(self, valor):
        self.valor = valor

    def balance(self):
        self.api.change_balance('REAL')
        return self.api.get_balance()
    def buy(self):
        check, id = self.api.buy(self.valor, self.paridade, self.direcao, self.expiracao)
        if check:
            print('ordem aberta')

    
