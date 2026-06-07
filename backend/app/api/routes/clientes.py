from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteCreate, ClienteUpdate, ClienteResponse

router = APIRouter()


@router.get("/", response_model=List[ClienteResponse])
def listar_clientes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Listar todos os clientes com paginação e busca
    """
    query = db.query(Cliente)

    if search:
        query = query.filter(
            (Cliente.nome.ilike(f"%{search}%")) |
            (Cliente.email.ilike(f"%{search}%")) |
            (Cliente.cpf.contains(search))
        )

    clientes = query.offset(skip).limit(limit).all()
    return clientes


@router.get("/{cliente_id}", response_model=ClienteResponse)
def buscar_cliente(cliente_id: str, db: Session = Depends(get_db)):
    """
    Buscar cliente por ID
    """
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    return cliente


@router.post("/", response_model=ClienteResponse, status_code=201)
def criar_cliente(cliente_data: ClienteCreate, db: Session = Depends(get_db)):
    """
    Criar novo cliente
    """
    # Verificar se CPF já existe
    if db.query(Cliente).filter(Cliente.cpf == cliente_data.cpf).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado")

    # Verificar se email já existe
    if db.query(Cliente).filter(Cliente.email == cliente_data.email).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado")

    # Criar cliente
    cliente = Cliente(**cliente_data.model_dump())
    db.add(cliente)
    db.commit()
    db.refresh(cliente)

    return cliente

@router.put("/{cliente_id}", response_model=ClienteResponse)
def atualizar_cliente(
    cliente_id: str,
    cliente_data: ClienteUpdate,
    db: Session = Depends(get_db)
):
    """
    Atualizar cliente existente
    """
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    # Atualizar campos
    for key, value in cliente_data.model_dump(exclude_unset=True).items():
        setattr(cliente, key, value)

    db.commit()
    db.refresh(cliente)

    return cliente

@router.delete("/{cliente_id}", status_code=204)
def deletar_cliente(cliente_id: str, db: Session = Depends(get_db)):
    """
    Deletar cliente
    """
    cliente = db.query(Cliente).filter(Cliente.id == cliente_id).first()

    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")

    db.delete(cliente)
    db.commit()

    return None
