from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OrderCreate(BaseModel):
    cliente_id: str = Field(alias="clienteId")
    carro_id: str = Field(alias="carroId")
    descricao: str
    valor: float = 0
    observacoes: Optional[str] = None

    model_config = ConfigDict(populate_by_name=True)


class OrderUpdate(BaseModel):
    descricao: Optional[str] = None
    status: Optional[str] = None
    valor: Optional[float] = None
    observacoes: Optional[str] = None
    data_saida: Optional[datetime] = Field(default=None, alias="dataSaida")

    model_config = ConfigDict(populate_by_name=True)


class OrderResponse(BaseModel):
    id: str
    cliente_id: str = Field(alias="clienteId")
    carro_id: str = Field(alias="carroId")
    cliente_nome: str = Field(alias="clienteNome")
    placa: str
    marca: str
    modelo: str
    ano: int
    quilometragem: int = Field(alias="quilometragem")
    descricao: str
    status: str
    valor: float
    observacoes: Optional[str] = None
    data_entrada: datetime = Field(alias="dataEntrada")
    data_saida: Optional[datetime] = Field(default=None, alias="dataSaida")
    created_at: datetime = Field(alias="createdAt")
    updated_at: Optional[datetime] = Field(default=None, alias="updatedAt")

    model_config = ConfigDict(populate_by_name=True)
