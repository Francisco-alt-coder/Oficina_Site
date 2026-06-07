from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import logging
from contextlib import asynccontextmanager

# IMPORTS DAS ROTAS
from app.api.routes import router as api_router


from app.core.config import settings
from app.db.session import engine
from app.db.base import Base


# CONFIGURAÇÃO DE LOG
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# CICLO DE VIDA DA APLICAÇÃO
@asynccontextmanager
async def lifespan(app: FastAPI):

    logger.info("Iniciando aplicação...")

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Tabelas criadas/verificadas com sucesso")

    except Exception as e:
        logger.error(f"Erro ao criar tabelas: {e}")
        raise

    yield

    logger.info("Encerrando aplicação...")


# INSTÂNCIA DO FASTAPI
app = FastAPI(
    title="Sistema de Oficina Mecânica API",
    description="API REST para gestão de oficina mecânica",
    version="1.0.0",
    lifespan=lifespan,
)


# CONFIGURAÇÃO CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# MIDDLEWARE DE TEMPO DE RESPOSTA
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):

    start_time = time.time()

    response = await call_next(request)

    process_time = round(time.time() - start_time, 4)

    response.headers["X-Process-Time"] = str(process_time)

    return response


# HEALTH CHECK
@app.get("/health", tags=["Health"])
async def health_check():

    return {
        "status": "OK",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }

@app.get("/", tags=["Home"])
async def home():
    return {
        "sistema": "Sistema de Oficina Mecânica",
        "versao": "1.0.0",
        "status": "Online",
        "documentacao": "/docs"
    }

# ROTAS DA API
app.include_router(api_router, prefix="/api")

# TRATAMENTO GLOBAL DE ERROS
@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception
):

    logger.error(
        f"Erro não tratado: {exc}",
        exc_info=True
    )

    return JSONResponse(
        status_code=500,
        content={
            "error": "Erro interno do servidor",
            "detail": (
                str(exc)
                if settings.ENVIRONMENT == "development"
                else None
            ),
        },
    )


# EXECUÇÃO LOCAL
if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.ENVIRONMENT == "development",
    )