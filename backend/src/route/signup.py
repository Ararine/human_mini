from fastapi import APIRouter, Request
from controller.signup import (
    register,
    check_username,
    send_email_code,
    verify_email_code
)

router = APIRouter()

router.post("/register")(register)          
router.get("/check-username/{username}")(check_username)
router.post("/send-email-code")(send_email_code)
router.post("/verify-email-code")(verify_email_code)
