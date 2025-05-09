from fastapi import APIRouter
from api.endpoint import user
router = APIRouter()

router.include_router(user.user_router)