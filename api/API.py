from iqoptionapi.stable_api import IQ_Option
import time

class API:
    def __init__(self, paridade='', valor=2, expiracao='', direcao='', tipo='', email='fokrainsdetrosovisk@gmail.com', senha='Teste123'):
        self.paridade = paridade
        self.valor = int(valor) 
        self.senha = senha
        self.expiracao = expiracao
        self.action = 'call' if direcao=='CIMA' else 'put'
        self.email = email
        self.tipo = tipo
        self.api = None

        print(self.email, self.senha)

    def connect(self):
        self.api = IQ_Option(self.email, self.senha)
        check, reason = self.api.connect()
        self.api.change_balance("PRACTICE")
        print(check, "\n",reason)
        #print(self.api.check_connection())
    
    def paridades(self):
        assets = self.api.get_all_open_time()
        binary = []
        digital = []
        for asset in assets["binary"]:
            if assets["binary"][asset]["open"]:
                binary.append(asset)
        
        for asset in assets["digital"]:
            if assets["digital"][asset]["open"]:
                digital.append(asset)
        
        return binary, digital
    
    def connect_and_buy(self, email, senha, paridade, price, direcao, expiracao, tipo):
        conta = IQ_Option(email, senha)
        check, reason = conta.connect()
        conta.change_balance("PRACTICE")
        print(check, reason)
        
        action = 'call' if direcao=='CIMA' else 'put'
        valor = int(price)
        expiracao = int(expiracao)
        
        if (tipo=='BINÁRIA'):
            check, id = conta.buy(valor, paridade, action, expiracao)
            if check:
                print('ordem aberta')
        if (tipo=='DIGITAL'):
            print('digital')
            check, id = conta.buy_digital_spot(paridade, valor, action, expiracao)
            if check:
                print("ordem aberta")
        return check


    def balance(self):
        self.api.change_balance('REAL')
        return self.api.get_balance()
    def buy(self):
        print(self.action, self.valor, self.paridade, self.expiracao)

        if (self.tipo=='BINÁRIA'):
            check, id = self.api.buy(self.valor, self.paridade, self.action, self.expiracao)
            if check:
                print('ordem aberta')
        if (self.tipo=='DIGITAL'):
            print('digital')
            check, id = self.api.buy_digital_spot(self.paridade, self.valor, self.action, self.expiracao)
            if check:
                print("ordem aberta")
        return check

    
