from fastapi import Path, Body, status, Request, Query
from fastapi.responses import JSONResponse
import service.history as history_service
from fastapi.encoders import jsonable_encoder

def get_search_history(request: Request) :
    try :
        loginYn = True if "user" in request.session else False
        histories = []
        if loginYn :
            histories = history_service.get_search_history_query(str(request.session["user"]))
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content=jsonable_encoder({"message": "공원 검색 정보 조회 성공", "histories": histories})
            )
        else :
            return JSONResponse(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    content={"message": "로그인 필요"}
            )
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "공원 검색 정보 조회 실패", "error" : str(e)}
        )
        
def delete_search_history(request: Request, id : int = Path(...)) :
    try:
        loginYn = True if "user" in request.session else False
        if loginYn and id:
            res = history_service.delete_search_history_query(request.session["user"], id)
            if res :
                return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "공원 검색 정보 삭제 성공"}
                )
            else :
                return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "공원 검색 정보 삭제 실패"}
                )
        elif not loginYn :
            return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "로그인 필요"}
        )
        elif not id :
            return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "키값 누락"}
            )
    except Exception as e :
        print(e)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "공원 검색 정보 삭제 실패", "error" : str(e)}
        )
        
def delete_all_search_history(request: Request) :
    try:
        loginYn = True if "user" in request.session else False
        if loginYn and id:
            res = history_service.delete_all_search_history_query(request.session["user"])
            if res :
                return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "공원 검색 정보 전체 삭제 성공"}
                )
            else :
                return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "공원 검색 정보 전체 삭제 실패"}
                )
        elif not loginYn :
            return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "로그인 필요"}
        )
    except Exception as e :
        print(e)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "공원 검색 정보 전체 삭제 실패", "error" : str(e)}
        )