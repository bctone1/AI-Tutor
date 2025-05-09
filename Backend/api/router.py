from fastapi import APIRouter
from api.endpoint import user, llm, exam
router = APIRouter()

router.include_router(user.user_router)

router.include_router(llm.llm_router)

router.include_router(exam.exam_router)