from pydantic import BaseModel


class VehicleCreate(BaseModel):
    placa: str
    modelo: str
    marca: str
    ano: int


class VehicleResponse(VehicleCreate):
    id: int