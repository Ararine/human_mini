from fastapi import APIRouter
from controller import mypage

router = APIRouter()

router.add_api_route("/users/{username}", mypage.patch_user, methods=["PATCH"])
router.add_api_route("/users/{username}", mypage.delete_user, methods=["DELETE"])