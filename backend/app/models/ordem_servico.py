from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.db.session import Base


class StatusOrdem(str, enum.Enum):
    PENDENTE = "pendente"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDO = "concluido"
    CANCELADO = "cancelado"


class OrdemServico(Base):
    __tablename__ = "ordens_servico"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    cliente_id = Column(String, ForeignKey("clientes.id"), nullable=False, index=True)
    carro_id = Column(String, ForeignKey("carros.id"), nullable=False, index=True)
    descricao = Column(String, nullable=False)
    status = Column(SQLEnum(StatusOrdem), default=StatusOrdem.PENDENTE, index=True)
    valor_total = Column(Numeric(10, 2), nullable=False)
    data_abertura = Column(DateTime(timezone=True), server_default=func.now())
    data_conclusao = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relacionamentos
    cliente = relationship("Cliente", back_populates="ordens")
    carro = relationship("Carro", back_populates="ordens")

    def __repr__(self):
        return f"<OrdemServico {self.id} - {self.status}>"
