from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import uuid

from app.db.session import Base


class Carro(Base):
    """Model de veículos"""

    __tablename__ = "carros"

    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    cliente_id = Column(
        String,
        ForeignKey(
            "clientes.id",
            ondelete="CASCADE"
        ),
        nullable=False,
        index=True
    )

    marca = Column(
        String(100),
        nullable=False
    )

    modelo = Column(
        String(100),
        nullable=False
    )

    ano = Column(
        Integer,
        nullable=False
    )

    placa = Column(
        String(8),
        unique=True,
        nullable=False,
        index=True
    )

    cor = Column(
        String(50),
        nullable=False
    )

    km = Column(
        Integer,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relacionamentos

    cliente = relationship(
        "Cliente",
        back_populates="carros"
    )

    ordens = relationship(
        "OrdemServico",
        back_populates="carro",
        cascade="all, delete-orphan"
    )

    def __repr__(self):

        return (
            f"<Carro "
            f"{self.marca} "
            f"{self.modelo} "
            f"- {self.placa}>"
        )
