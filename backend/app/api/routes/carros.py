from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.carro import Carro
from app.models.cliente import Cliente
from app.schemas.carros import VehicleCreate, VehicleResponse

router = APIRouter(tags=["Gestão de Veículos"])


def serialize_carro(carro: Carro) -> dict:
    return {
        "id": carro.id,
        "placa": carro.placa,
        "modelo": carro.modelo,
        "marca": carro.marca,
        "ano": carro.ano,
        "clienteId": carro.cliente_id,
        "clienteNome": carro.cliente.nome if carro.cliente else None,
        "cor": carro.cor,
        "quilometragem": carro.km,
    }


@router.get("/", response_model=List[VehicleResponse])
def listar_carros(db: Session = Depends(get_db)):
    carros = db.query(Carro).order_by(Carro.created_at.desc()).all()
    return [serialize_carro(carro) for carro in carros]


@router.post("/", response_model=VehicleResponse, status_code=201)
def cadastrar_carro(veiculo: VehicleCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == veiculo.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    placa = veiculo.placa.upper()
    if db.query(Carro).filter(Carro.placa == placa).first():
        raise HTTPException(status_code=400, detail="Placa já cadastrada")

    carro = Carro(
        cliente_id=veiculo.cliente_id,
        placa=placa,
        modelo=veiculo.modelo,
        marca=veiculo.marca,
        ano=veiculo.ano,
        cor=veiculo.cor,
        km=veiculo.km,
    )
    db.add(carro)
    db.commit()
    db.refresh(carro)

    return serialize_carro(carro)


@router.get("/cliente/{id_cliente}", response_model=List[VehicleResponse])
def listar_carros_por_cliente(id_cliente: str, db: Session = Depends(get_db)):
    carros = db.query(Carro).filter(Carro.cliente_id == id_cliente).all()
    return [serialize_carro(carro) for carro in carros]


@router.get("/{placa}", response_model=VehicleResponse)
def buscar_carro_por_placa(placa: str, db: Session = Depends(get_db)):
    carro = db.query(Carro).filter(Carro.placa == placa.upper()).first()
    if not carro:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    return serialize_carro(carro)


@router.put("/{id_veiculo}", response_model=VehicleResponse)
def atualizar_veiculo(
    id_veiculo: str,
    dados: VehicleCreate,
    db: Session = Depends(get_db),
):
    carro = db.query(Carro).filter(Carro.id == id_veiculo).first()
    if not carro:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    cliente = db.query(Cliente).filter(Cliente.id == dados.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    placa = dados.placa.upper()
    placa_em_uso = (
        db.query(Carro)
        .filter(Carro.placa == placa, Carro.id != id_veiculo)
        .first()
    )
    if placa_em_uso:
        raise HTTPException(status_code=400, detail="Placa já cadastrada")

    carro.cliente_id = dados.cliente_id
    carro.placa = placa
    carro.modelo = dados.modelo
    carro.marca = dados.marca
    carro.ano = dados.ano
    carro.cor = dados.cor
    carro.km = dados.km

    db.commit()
    db.refresh(carro)

    return serialize_carro(carro)


@router.delete("/{id_veiculo}", status_code=204)
def excluir_veiculo(id_veiculo: str, db: Session = Depends(get_db)):
    carro = db.query(Carro).filter(Carro.id == id_veiculo).first()
    if not carro:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    db.delete(carro)
    db.commit()

    return None
