from pydantic import BaseModel
from app.schemas.carros import VehicleCreate, VehicleResponse

class OrderCreate(BaseModel):
    descricao: str
    valor: float


class OrderResponse(BaseModel):
    id: int
    descricao: str
    status: str
    valor: float