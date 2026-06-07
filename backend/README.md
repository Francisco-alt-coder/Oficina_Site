# Backend - Oficina Pro

API em Python para o sistema de gestão de oficina mecânica. O backend atual usa FastAPI, SQLAlchemy e banco SQLite local durante o desenvolvimento.

## Estado Atual

- API REST com FastAPI.
- Banco configurado por `backend/.env`.
- Ambiente atual usando SQLite: `sqlite:///./banco.db`.
- Criação/verificação automática das tabelas ao iniciar a aplicação.
- Rotas principais para clientes, veículos e ordens de serviço.
- Documentação interativa gerada pelo FastAPI.

## Requisitos

- Python 3.11 ou superior.
- Ambiente virtual Python.
- Dependências instaladas a partir de `backend/requirements.txt`.

## Instalação

Na raiz do projeto:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

## Configuração

O backend lê variáveis do arquivo `backend/.env`.

Exemplo para desenvolvimento local com SQLite:

```env
ENVIRONMENT=development
DEBUG=True
PORT=8000
DATABASE_URL=sqlite:///./banco.db
SECRET_KEY=sua-chave-local
```

Para PostgreSQL, ajuste `DATABASE_URL` e mantenha `psycopg2-binary` instalado:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/oficina
```

## Execução

Na raiz do projeto:

```powershell
cd backend
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

A API ficará disponível em:

- API: `http://127.0.0.1:8000`
- Health check: `http://127.0.0.1:8000/health`
- Swagger: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Rotas Principais

### Clientes

- `GET /api/clientes`
- `GET /api/clientes/{cliente_id}`
- `POST /api/clientes`
- `PUT /api/clientes/{cliente_id}`
- `DELETE /api/clientes/{cliente_id}`

### Veículos

- `POST /api/carros`
- `GET /api/carros/cliente/{id_cliente}`
- `GET /api/carros/{placa}`
- `PUT /api/carros/{id_veiculo}`
- `DELETE /api/carros/{id_veiculo}`

### Ordens de Serviço

- `GET /api/ordens`
- `GET /api/ordens/{id_ordem}`
- `POST /api/ordens`
- `PATCH /api/ordens/{id_ordem}/status`

## Estrutura

```text
backend/
├── app/
│   ├── api/routes/
│   │   ├── carros.py
│   │   ├── clientes.py
│   │   └── ordens.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   │   ├── base.py
│   │   └── session.py
│   ├── models/
│   │   ├── carro.py
│   │   ├── cliente.py
│   │   └── ordem_servico.py
│   ├── schemas/
│   │   ├── carros.py
│   │   ├── cliente.py
│   │   └── ordens.py
│   └── main.py
├── .env
├── banco.db
├── README.md
└── requirements.txt
```

## Validação

Para validar imports e dependências:

```powershell
..\venv\Scripts\python.exe -m pip check
..\venv\Scripts\python.exe -m compileall app
```

Para validar manualmente se a API está respondendo:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health -UseBasicParsing
```

## Observações

- O arquivo `requirements.txt` deste diretório deve ser a referência principal das dependências Python do backend.
- O banco SQLite atual é adequado para desenvolvimento local.
- PostgreSQL continua possível por configuração, mas não é obrigatório para rodar o sistema hoje.
- Autenticação JWT, hashing de senhas, migrations com Alembic e deploy Heroku não estão implementados no fluxo atual e por isso não fazem parte desta documentação.
