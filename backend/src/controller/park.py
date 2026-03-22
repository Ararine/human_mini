from fastapi import Path, Body, status, Request, Query
from fastapi.responses import JSONResponse
import service.park as park_service
import service.history as history_service
from schema.mypage import PatchUserRequest

async def get_park(request: Request, coordinate : list[float] = Query(...), keyword: str = Query(...)):
    try:
        parks = await park_service.get_park(keyword, coordinate)
        username = request.session["user"]
        # print("parks", parks)
        if username :
            history_service.add_search_query(keyword, username)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "공원 정보 조회 성공", "parks": parks}
        )
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "공원 정보 조회 실패", "error" : str(e)}
        )
        
# 미구현 소스
# async def get_park(request: Request, keyword: str = Query(...)):
#     try:
#         (parks, feature_collection) = await park_service.get_park(keyword)
#         username = request.session["user"]
#         # print("parks", parks)
#         # print("feature_collection", feature_collection)
#         if username :
#             history_service.add_search_query(keyword, username)
#         return JSONResponse(
#             status_code=status.HTTP_200_OK,
#             content={"message": "공원 정보 조회 성공", "parks": parks, "feature_collection" : feature_collection}
#         )
#     except Exception as e:
#         print(e)
#         return JSONResponse(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             content={"message": "공원 정보 조회 실패", "error" : str(e)}
#         )