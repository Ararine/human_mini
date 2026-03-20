from fastapi import APIRouter
from controller.find_user import (
    find_id_send_code,
    find_id_verify_code,
    find_password_send_code,
    find_password_verify_code,
    reset_password
)

router = APIRouter()

router.post("/find-id/send-code")(find_id_send_code)
router.post("/find-id/verify-code")(find_id_verify_code)
router.post("/find-password/send-code")(find_password_send_code)
router.post("/find-password/verify-code")(find_password_verify_code)
router.post("/find-password/reset")(reset_password)