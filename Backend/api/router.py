from fastapi import APIRouter
from api.endpoint import user, llm
router = APIRouter()

router.include_router(user.user_router)

router.include_router(llm.llm_router)