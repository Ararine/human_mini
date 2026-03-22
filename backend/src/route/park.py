from fastapi import APIRouter, Request
from controller import park as park_controller

router = APIRouter()

router.add_api_route("/", park_controller.get_park, methods=["GET"])
