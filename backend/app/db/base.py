from app.db.session import Base

# Importar todos os models aqui para que o Alembic possa detectá-los
from app.models.cliente import Cliente
from app.models.carro import Carro
from app.models.ordem_servico import OrdemServico

__all__ = [
    "Base",
    "Cliente",
    "Carro",
    "OrdemServico"
]