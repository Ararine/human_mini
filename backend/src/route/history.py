from fastapi import APIRouter, Request
from controller import history as history_controller

router = APIRouter()

router.add_api_route("/get-search-history", history_controller.get_search_history, methods=["POST"])
router.add_api_route("/delete-search-history/{id}", history_controller.delete_search_history, methods=["DELETE"])
router.add_api_route("/delete-all-search-history", history_controller.delete_all_search_history, methods=["DELETE"])