from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.db.session import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    nome = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    cpf = Column(String(14), unique=True, nullable=False, index=True)
    telefone = Column(String(15), nullable=False)
    data_cadastro = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    carros = relationship("Carro", back_populates="cliente", cascade="all, delete-orphan")
    ordens = relationship("OrdemServico", back_populates="cliente")

    def __repr__(self):
        return f"<Cliente {self.nome} - {self.cpf}>"
