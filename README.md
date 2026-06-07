# Oficina Pro

Sistema de gestao para oficina mecanica, com frontend em React/Vite e backend em FastAPI. A aplicacao permite acessar um painel administrativo, gerenciar clientes, veiculos e ordens de servico, com integracao entre a interface web e a API local.

## Tecnologias

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios
- Lucide React
- Playwright para testes E2E

### Backend

- Python 3.11+
- FastAPI
- SQLAlchemy
- Pydantic
- Pydantic Settings
- Uvicorn
- SQLite em desenvolvimento local
- PostgreSQL opcional por configuracao

## Requisitos

- Node.js 20 ou superior recomendado.
- npm.
- Python 3.11 ou superior.
- Ambiente virtual Python em `venv`.
- Navegador moderno.

## Estrutura do Projeto

```text
Oficina_Site/
|-- backend/
|   |-- app/
|   |   |-- api/routes/
|   |   |   |-- carros.py
|   |   |   |-- clientes.py
|   |   |   `-- ordens.py
|   |   |-- core/
|   |   |   `-- config.py
|   |   |-- db/
|   |   |   |-- base.py
|   |   |   `-- session.py
|   |   |-- models/
|   |   |   |-- carro.py
|   |   |   |-- cliente.py
|   |   |   `-- ordem_servico.py
|   |   |-- schemas/
|   |   |   |-- carros.py
|   |   |   |-- cliente.py
|   |   |   `-- ordens.py
|   |   `-- main.py
|   |-- .env
|   |-- banco.db
|   |-- README.md
|   `-- requirements.txt
|-- frontend/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- contexts/
|   |   |-- layouts/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- styles/
|   |-- index.html
|   |-- package.json
|   |-- playwright.config.ts
|   |-- tsconfig.json
|   `-- vite.config.ts
|-- venv/
|-- README.md
`-- requirements.txt
```

## Como Executar o Backend

Na raiz do projeto:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r backend\requirements.txt
```

Depois execute a API:

```powershell
cd backend
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Enderecos uteis:

- API: `http://127.0.0.1:8000`
- Health check: `http://127.0.0.1:8000/health`
- Swagger: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## Como Executar o Frontend

Em outro terminal, entre na pasta do frontend:

```powershell
cd frontend
npm install
npm run dev
```

O frontend fica disponivel em:

```text
http://127.0.0.1:5173
```

## Rotas Principais

### Frontend

- `/`: login
- `/home`: inicio
- `/dashboard`: painel principal
- `/clientes`: gestao de clientes
- `/veiculos`: gestao de veiculos
- `/ordens-servico`: ordens de servico

### Backend

- `GET /health`
- `GET /api/clientes`
- `GET /api/clientes/{cliente_id}`
- `POST /api/clientes`
- `PUT /api/clientes/{cliente_id}`
- `DELETE /api/clientes/{cliente_id}`
- `POST /api/carros`
- `GET /api/carros/cliente/{id_cliente}`
- `GET /api/carros/{placa}`
- `PUT /api/carros/{id_veiculo}`
- `DELETE /api/carros/{id_veiculo}`
- `GET /api/ordens`
- `GET /api/ordens/{id_ordem}`
- `POST /api/ordens`
- `PATCH /api/ordens/{id_ordem}/status`

## Configuracao do Backend

O backend usa o arquivo `backend/.env`. No ambiente atual de desenvolvimento, o banco esta configurado como SQLite:

```env
DATABASE_URL=sqlite:///./banco.db
```

PostgreSQL pode ser usado ajustando a variavel `DATABASE_URL`, desde que o banco esteja disponivel e as dependencias Python estejam instaladas.

## Instrucoes de Desenvolvimento

### Frontend

```powershell
cd frontend
npm run dev
npm run build
npm run check-types
```

Scripts disponiveis:

- `npm run dev`: inicia o Vite em desenvolvimento.
- `npm run build`: compila TypeScript e gera build de producao.
- `npm run preview`: serve o build localmente.
- `npm run check-types`: executa checagem TypeScript sem emitir arquivos.
- `npm run test:e2e`: executa testes Playwright, quando existirem testes configurados.

### Backend

```powershell
cd backend
..\venv\Scripts\python.exe -m pip check
..\venv\Scripts\python.exe -m compileall app
..\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## Validacao Rapida

Com frontend e backend rodando:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health -UseBasicParsing
Invoke-WebRequest http://127.0.0.1:5173/veiculos -UseBasicParsing
```

Respostas `200` indicam que os servicos locais estao acessiveis.

## Observacoes

- O arquivo `backend/requirements.txt` e a referencia principal das dependencias Python do backend.
- O arquivo `frontend/package.json` concentra os scripts e dependencias do frontend.
- O diretorio `frontend/node_modules` e gerado pelo npm e nao deve ser editado manualmente.
- O diretorio `frontend/dist` e gerado pelo build de producao.
