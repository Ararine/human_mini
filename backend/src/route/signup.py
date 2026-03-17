from fastapi import APIRouter, Request
from controller.signup import register, check_username

router = APIRouter()

router.post("/register")(register)          
router.get("/check-username/{username}")(check_username)
