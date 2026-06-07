from fastapi import APIRouter

from .clientes import router as cliente_router
from .carros import router as carros_router
from .ordens import router as ordens_router

router = APIRouter()

router.include_router(
    cliente_router,
    prefix="/clientes",
    tags=["Clientes"]
)

router.include_router(
    carros_router,
    prefix="/carros",
    tags=["Carros"]
)

router.include_router(
    ordens_router,
    prefix="/ordens",
    tags=["Ordens"]
)