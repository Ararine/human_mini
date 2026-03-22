from fastapi import APIRouter
from controller.signup import (
    register,
    check_username,
    send_email_code,
    verify_email_code
)

router = APIRouter()

router.add_api_route("/register", register, methods=["POST"])          
router.add_api_route("/check-username/{username}", check_username, methods=["GET"])
router.add_api_route("/send-email-code", send_email_code, methods=["POST"])
router.add_api_route("/verify-email-code", verify_email_code, methods=["POST"])
