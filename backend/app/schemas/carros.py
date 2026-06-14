from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class VehicleCreate(BaseModel):
    placa: str
    modelo: str
    marca: str
    ano: int
    cliente_id: str = Field(alias="clienteId")
    cor: str = "Não informada"
    km: int = Field(default=0, alias="quilometragem")

    model_config = ConfigDict(populate_by_name=True)


class VehicleResponse(VehicleCreate):
    id: str
    cliente_nome: Optional[str] = Field(default=None, alias="clienteNome")

    model_config = ConfigDict(populate_by_name=True)
