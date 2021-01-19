from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column,Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

Base = declarative_base()

class Conta(Base):
    __tablename__ == 'contas'
    id = Column(Integer, primary_key=True)
    email = Column(String)
    senha = Column(String)
    valor_id = Column(Integer, ForeignKey('operacoes.id'))
    valor = relationship("Operacoes")
    def __repr__(self):
        return "<Conta (email='{}', senha='{}')>".format(self.email, self.senha)
    
class Operacoes(Base):
    __tablename__ = 'operacoes'
    id = Column(Integer, primary_key=True)
    valor = Column(Integer)
    soros = Column(String)
    nivel = Column(Integer)