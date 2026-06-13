# Backend - Oficina Pro

API REST do projeto Oficina Pro, criada com FastAPI e SQLAlchemy para gerenciar clientes, veiculos e ordens de servico.

## Tecnologias

- Python 3.11+
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn
- SQLite em desenvolvimento local

## Instalacao

Na raiz do projeto:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

## Execucao

Ainda com o ambiente virtual ativo:

```powershell
cd backend
uvicorn app.main:app --reload
```

Enderecos locais:

- Swagger: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

## Configuracao

O backend usa SQLite por padrao em desenvolvimento:

```text
sqlite:///./banco.db
```

Tambem e possivel criar um arquivo `.env` dentro de `backend/` para sobrescrever configuracoes locais, por exemplo:

```env
ENVIRONMENT=development
DEBUG=True
PORT=8000
DATABASE_URL=sqlite:///./banco.db
SECRET_KEY=sua-chave-local
```

## Rotas principais

- `GET /health`
- `GET /api/clientes`
- `POST /api/clientes`
- `GET /api/carros/cliente/{id_cliente}`
- `POST /api/carros`
- `GET /api/ordens`
- `POST /api/ordens`
- `PATCH /api/ordens/{id_ordem}/status`
