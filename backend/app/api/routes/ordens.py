from datetime import datetime
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.carro import Carro
from app.models.cliente import Cliente
from app.models.ordem_servico import OrdemServico, StatusOrdem
from app.schemas.ordens import OrderCreate, OrderResponse, OrderUpdate

router = APIRouter(tags=["Ordens de Serviço"])


STATUS_LABELS = {
    StatusOrdem.PENDENTE: "Aberta",
    StatusOrdem.EM_ANDAMENTO: "Em andamento",
    StatusOrdem.CONCLUIDO: "Concluída",
    StatusOrdem.CANCELADO: "Cancelada",
}

STATUS_BY_LABEL = {
    "Aberta": StatusOrdem.PENDENTE,
    "Pendente": StatusOrdem.PENDENTE,
    "Em andamento": StatusOrdem.EM_ANDAMENTO,
    "Concluída": StatusOrdem.CONCLUIDO,
    "Finalizada": StatusOrdem.CONCLUIDO,
    "Cancelada": StatusOrdem.CANCELADO,
    "pendente": StatusOrdem.PENDENTE,
    "em_andamento": StatusOrdem.EM_ANDAMENTO,
    "concluido": StatusOrdem.CONCLUIDO,
    "cancelado": StatusOrdem.CANCELADO,
}


def parse_status(status: str | None) -> StatusOrdem:
    if not status:
        return StatusOrdem.PENDENTE

    parsed = STATUS_BY_LABEL.get(status)
    if not parsed:
        raise HTTPException(status_code=400, detail="Status inválido")

    return parsed


def serialize_ordem(ordem: OrdemServico) -> dict:
    carro = ordem.carro

    return {
        "id": ordem.id,
        "clienteId": ordem.cliente_id,
        "carroId": ordem.carro_id,
        "clienteNome": ordem.cliente.nome if ordem.cliente else "",
        "placa": carro.placa if carro else "",
        "marca": carro.marca if carro else "",
        "modelo": carro.modelo if carro else "",
        "ano": carro.ano if carro else 0,
        "quilometragem": carro.km if carro else 0,
        "descricao": ordem.descricao,
        "status": STATUS_LABELS.get(ordem.status, "Aberta"),
        "valor": float(ordem.valor_total or Decimal("0")),
        "observacoes": None,
        "dataEntrada": ordem.data_abertura,
        "dataSaida": ordem.data_conclusao,
        "createdAt": ordem.data_abertura,
        "updatedAt": ordem.updated_at,
    }


@router.get("/", response_model=List[OrderResponse])
def listar_ordens(db: Session = Depends(get_db)):
    ordens = db.query(OrdemServico).order_by(OrdemServico.data_abertura.desc()).all()
    return [serialize_ordem(ordem) for ordem in ordens]


@router.post("/", response_model=OrderResponse, status_code=201)
def criar_ordem(ordem: OrderCreate, db: Session = Depends(get_db)):
    cliente = db.query(Cliente).filter(Cliente.id == ordem.cliente_id).first()
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    carro = db.query(Carro).filter(Carro.id == ordem.carro_id).first()
    if not carro:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    if carro.cliente_id != cliente.id:
        raise HTTPException(
            status_code=400,
            detail="Veículo não pertence ao cliente informado",
        )

    nova_ordem = OrdemServico(
        cliente_id=ordem.cliente_id,
        carro_id=ordem.carro_id,
        descricao=ordem.descricao,
        valor_total=Decimal(str(ordem.valor)),
        status=StatusOrdem.PENDENTE,
    )
    db.add(nova_ordem)
    db.commit()
    db.refresh(nova_ordem)

    return serialize_ordem(nova_ordem)


@router.get("/{id_ordem}", response_model=OrderResponse)
def buscar_ordem(id_ordem: str, db: Session = Depends(get_db)):
    ordem = db.query(OrdemServico).filter(OrdemServico.id == id_ordem).first()
    if not ordem:
        raise HTTPException(status_code=404, detail="Ordem não encontrada")

    return serialize_ordem(ordem)


@router.put("/{id_ordem}", response_model=OrderResponse)
def atualizar_ordem(
    id_ordem: str,
    dados: OrderUpdate,
    db: Session = Depends(get_db),
):
    ordem = db.query(OrdemServico).filter(OrdemServico.id == id_ordem).first()
    if not ordem:
        raise HTTPException(status_code=404, detail="Ordem não encontrada")

    if dados.descricao is not None:
        ordem.descricao = dados.descricao
    if dados.valor is not None:
        ordem.valor_total = Decimal(str(dados.valor))
    if dados.status is not None:
        ordem.status = parse_status(dados.status)
    if dados.data_saida is not None:
        ordem.data_conclusao = dados.data_saida
    elif dados.status in {"Concluída", "Finalizada", "concluido"} and not ordem.data_conclusao:
        ordem.data_conclusao = datetime.now()

    db.commit()
    db.refresh(ordem)

    return serialize_ordem(ordem)


@router.patch("/{id_ordem}/status", response_model=OrderResponse)
def atualizar_status(
    id_ordem: str,
    novo_status: str,
    db: Session = Depends(get_db),
):
    ordem = db.query(OrdemServico).filter(OrdemServico.id == id_ordem).first()
    if not ordem:
        raise HTTPException(status_code=404, detail="Ordem não encontrada")

    ordem.status = parse_status(novo_status)
    if ordem.status == StatusOrdem.CONCLUIDO and not ordem.data_conclusao:
        ordem.data_conclusao = datetime.now()

    db.commit()
    db.refresh(ordem)

    return serialize_ordem(ordem)


@router.delete("/{id_ordem}", status_code=204)
def excluir_ordem(id_ordem: str, db: Session = Depends(get_db)):
    ordem = db.query(OrdemServico).filter(OrdemServico.id == id_ordem).first()
    if not ordem:
        raise HTTPException(status_code=404, detail="Ordem não encontrada")

    db.delete(ordem)
    db.commit()

    return None
