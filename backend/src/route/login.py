from fastapi import APIRouter
from controller.login import login, reset_password, protected, logout  

router = APIRouter()

router.add_api_route("/login", login, methods=["POST"])         
router.add_api_route("/reset-password", reset_password, methods=["POST"])  
router.add_api_route("/protected", protected, methods=["GET"])   
router.add_api_route("/logout", logout, methods=["POST"])