# Oficina Pro

## Sobre o Projeto

O Oficina Pro é um sistema desenvolvido para auxiliar no gerenciamento de oficinas mecânicas. O sistema permite cadastrar clientes, veículos e realizar o controle das ordens de serviço.

## Equipe Responsavel
Francisco Wesley De Souza Dias

Desenvolvedor Full Stack

## Tecnologias Utilizadas

### Frontend

* React
* Vite
* TypeScript
* Tailwind CSS

### Backend

* FastAPI
* Python
* SQLite

## Como Executar o Projeto

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Explicação Do Backend

O backend foi desenvolvido utilizando FastAPI e Python, SQLite.

### Windows (PowerShell)

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Crie um ambiente virtual:

```bash
python -m venv venv
```

3. Ative o ambiente virtual:

```bash
.\venv\Scripts\activate
```

4. Instale as dependências:

```bash
pip install -r requirements.txt
```

5. Inicie o servidor:

```bash
uvicorn app.main:app --reload

```

### Linux (Ubuntu, Debian, Fedora, Arch )

1. Acesse a pasta do backend:

```bash
cd backend
```

2. Crie um ambiente virtual:

```bash
python3 -m venv venv
```

3. Ative o ambiente virtual:

```bash
source venv/bin/activate
```

4. Instale as dependências:

```bash
pip install -r requirements.txt
```

5. Execute o servidor:

```bash
uvicorn app.main:app --reload
```

Caso o comando `uvicorn` não seja encontrado, execute:

```bash
python3 -m uvicorn app.main:app --reload

## Linux 

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

A API ficará disponível em:

```text
http://127.0.0.1:8000
```

Documentação:

```text
http://127.0.0.1:8000/docs
```

### Frontend

Abra outra aba no powershell execute

```bash
cd frontend
npm install
npm run dev
```
## Linux 
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

