from iqoptionapi.stable_api import IQ_Option
import time

class API:
    def __init__(self, email, senha):
        self.senha = senha
        self.email = email
        self.api = None

        
        
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

    def balance(self):
        self.api.change_balance('REAL')
        return self.api.get_balance()
    def buy(self, paridade, price, direcao, expiracao, tipo):
        action = 'call' if direcao=='CIMA' else 'put'
        valor = int(price)
        expiracao = int(expiracao)
        print(action, valor, paridade, expiracao)

        if (tipo=='BINÁRIA'):
            check, id = self.api.buy(valor, paridade, action, expiracao)
            if check:
                print('ordem aberta')
        if (tipo=='DIGITAL'):
            print('digital')
            check, id = self.api.buy_digital_spot(paridade, valor, action, expiracao)
            if check:
                print("ordem aberta")

    
