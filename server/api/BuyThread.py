import threading
import time
from iqoptionapi.stable_api import IQ_Option

class BuyThread(threading.Thread):
    def __init__(self, threadName, email, senha, paridade, direcao, tipo, expiracao):
        threading.Thread.__init__(self)
        self.email = email
        self.senha = senha
        self.paridade = paridade
        self.direcao = direcao
        self.tipo = tipo
        self.expiracao = expiracao
        self.threadName = threadName
        self.conta = IQ_Option(self.email, self.senha)
        self.conta.connect()
        self.conta.change_balance("PRACTICE")

    def run(self):
        print("Login into", self.email, self.senha)
        connect_and_buy(self.conta, self.threadName, self.email, self.senha, self.paridade, self.direcao, self.tipo, self.expiracao)
         
def connect_and_buy(conta, threadName,email, senha, paridade, direcao, tipo, expiracao):    
    conta.buy(10, paridade, direcao, expiracao)
    time.sleep(1)
    print('compra')
    threadName.exit()
