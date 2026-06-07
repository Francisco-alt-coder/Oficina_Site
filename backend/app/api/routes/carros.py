from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas.carros import VehicleCreate, VehicleResponse

router = APIRouter(
    tags=["Gestão de Veículos"]
)

# Cadastrar Carro

@router.post(
    "/",
    response_model=VehicleResponse,
    status_code=201
)
def cadastrar_carro(veiculo: VehicleCreate):

    # Simulação de cadastro
    return VehicleResponse(
        id=1,
        placa=veiculo.placa,
        modelo=veiculo.modelo,
        marca=veiculo.marca,
        ano=veiculo.ano
    )

# Listar Veículos Do Cliente

@router.get(
    "/cliente/{id_cliente}",
    response_model=List[VehicleResponse]
)

def listar_carros_por_cliente(id_cliente: int):

    # Simulação de retorno
    return []

# Buscar Veículo Por Placa

@router.get(
    "/{placa}",
    response_model=VehicleResponse
)
def buscar_carro_por_placa(placa: str):

    # Simulação
    if placa != "ABC1234":
        raise HTTPException(
            status_code=404,
            detail="Veículo não encontrado"
        )

    return VehicleResponse(
        id=1,
        placa=placa,
        modelo="Civic",
        marca="Honda",
        ano=2022
    )

# Atualizar Veículo

@router.put(
    "/{id_veiculo}",
    response_model=VehicleResponse
)
def atualizar_veiculo(
    id_veiculo: int,
    dados: VehicleCreate
):

    return VehicleResponse(
        id=id_veiculo,
        placa=dados.placa,
        modelo=dados.modelo,
        marca=dados.marca,
        ano=dados.ano
    )



# Remover Veículo


@router.delete(
    "/{id_veiculo}",
    status_code=204
)
def excluir_veiculo(id_veiculo: int):

    return
