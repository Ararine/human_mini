from fastapi import APIRouter
from route import login, signup, mypage

router = APIRouter()

router.patch("/users/{username}")(mypage.patch_user)
router.delete("/users/{username}")(mypage.delete_user)