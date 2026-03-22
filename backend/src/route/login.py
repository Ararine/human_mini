from fastapi import APIRouter, Request
from controller import login as login_controller
from controller.login import login, reset_password, protected, logout  

router = APIRouter()

router.post("/login")(login)         
router.post("/reset-password")(reset_password)  
router.get("/protected")(protected)   
router.post("/logout")(logout)         
router.add_api_route("/get-user", login_controller.get_user, methods=["POST"])