from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.schemas.ordens import OrderCreate, OrderResponse


router = APIRouter(
    tags=["Ordens de Serviço"]
)

# Criar Ordem

@router.post(
    "/",
    response_model=OrderResponse,
    status_code=201
)
def criar_ordem(ordem: OrderCreate):

    # Simulação de criação
    return OrderResponse(
        id=1,
        descricao=ordem.descricao,
        status="aberta",
        valor=ordem.valor
    )

# Buscar Ordem

@router.get(
    "/{id_ordem}",
    response_model=OrderResponse
)
def buscar_ordem(id_ordem: int):

    if id_ordem <= 0:
        raise HTTPException(
            status_code=400,
            detail="ID inválido"
        )

    return OrderResponse(
        id=id_ordem,
        descricao="Troca de óleo",
        status="em andamento",
        valor=150.00
    )

# Listar Todas As Ordens De Serviço

@router.get(
    "/",
    response_model=List[OrderResponse]
)
def listar_ordens():

    return []

# Atualizar Status

@router.patch(
    "/{id_ordem}/status"
)
def atualizar_status(
    id_ordem: int,
    novo_status: str
):

    return {
        "id": id_ordem,
        "status": novo_status
    }
