# Oficina Pro

## Sobre o Projeto

O Oficina Pro é um sistema desenvolvido para auxiliar no gerenciamento de oficinas mecânicas. O sistema permite cadastrar clientes, veículos e realizar o controle das ordens de serviço.

## Tecnologias Utilizadas

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* SQLAlchemy
* SQLite

## Como Executar o Projeto

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

A API ficará disponível em:

```text
http://127.0.0.1:8000
```

Documentação:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O sistema ficará disponível em:

```text
http://127.0.0.1:5173
```

## Funcionalidades

* Cadastro de clientes
* Cadastro de veículos
* Cadastro de ordens de serviço
* Consulta de informações cadastradas
* Controle básico dos atendimentos

## Estrutura do Projeto

```text
Oficina-Pro/
├── backend/
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

## Equipe

Projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento de Sistemas.
