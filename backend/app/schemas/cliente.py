from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime
from typing import Optional
import re

from app.schemas.carros import VehicleCreate, VehicleResponse

class ClienteBase(BaseModel):
    nome: str
    email: EmailStr
    cpf: str
    telefone: str

    @field_validator('cpf')
    def validar_cpf(cls, v):
        # Remover caracteres especiais
        cpf = re.sub(r'\D', '', v)

        if len(cpf) != 11:
            raise ValueError('CPF deve ter 11 dígitos')

        # Formatar CPF
        return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"

    @field_validator('telefone')
    def validar_telefone(cls, v):
        # Remover caracteres especiais
        tel = re.sub(r'\D', '', v)

        if len(tel) not in [10, 11]:
            raise ValueError('Telefone inválido')

        # Formatar telefone
        if len(tel) == 11:
            return f"({tel[:2]}) {tel[2:7]}-{tel[7:]}"
        else:
            return f"({tel[:2]}) {tel[2:6]}-{tel[6:]}"


class ClienteCreate(ClienteBase):
    pass


class ClienteUpdate(BaseModel):
    nome: Optional[str] = None
    email: Optional[EmailStr] = None
    cpf: Optional[str] = None
    telefone: Optional[str] = None


class ClienteResponse(ClienteBase):
    id: str
    data_cadastro: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
