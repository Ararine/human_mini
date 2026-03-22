from fastapi import APIRouter
from controller.find_user import (
    find_id_send_code,
    find_id_verify_code,
    find_password_send_code,
    find_password_verify_code,
    reset_password
)

router = APIRouter()

router.add_api_route("/find-id/send-code", find_id_send_code, methods=["POST"])
router.add_api_route("/find-id/verify-code", find_id_verify_code, methods=["POST"])
router.add_api_route("/find-password/send-code", find_password_send_code, methods=["POST"])
router.add_api_route("/find-password/verify-code", find_password_verify_code, methods=["POST"])
router.add_api_route("/find-password/reset", reset_password, methods=["POST"])