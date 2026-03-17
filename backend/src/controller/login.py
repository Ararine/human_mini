import os 

from fastapi import APIRouter, Request, status, Body  
from fastapi.responses import JSONResponse
from sqlalchemy import text 
from util.database import engine


# pip install PyJWT 설치
import jwt   # JWT 토큰 처리용

from schema.login import LoginRequest, PasswordChangeRequest   
import service.login as login_service
from service.login import check_user_exists

router = APIRouter()


# 로그인 API 
@router.post("/login")
async def login(request: Request, data: LoginRequest):
    try:
        if login_service.verify_user(data.username, data.password):
            request.session["user"] = data.username
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "로그인 성공"}
            )
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "로그인 실패"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "서버 오류", "error": str(e)}
        )
        
        
# 비밀번호 변경 API 
@router.post("/reset-password")
async def reset_password(data: PasswordChangeRequest):
    try:
        if login_service.change_password(data.username, data.old_password, data.new_password):
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message": "비밀번호가 변경되었습니다."}
            )
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"message": "비밀번호 변경 실패"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"message": "서버 오류", "error": str(e)}
        )


# 구글 로그인(프론트엔드에 .env에 클라이언트 아이디 필요)
@router.post("/google-login")
async def google_login(token: str = Body(..., embed=True)):
    try:
        decoded = jwt.decode(token, options={"verify_signature": False})
        email = decoded.get("email")
        name = decoded.get("name")
        if not email or not name:
            return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, 
                                content={"message": "잘못된 토큰 정보"})

        if not check_user_exists(email, name):
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, 
                                content={"message": "로그인 실패"})

        return JSONResponse(status_code=status.HTTP_200_OK, 
                            content={"message": "로그인 성공"})

    except jwt.PyJWTError:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, 
                            content={"message": "유효하지 않은 토큰"})
        

# 인증 필요 API 
# 로그인한 사용자만 접근해야 하는 보호된 페이지나 기능에서 호출
# 다른 페이지에서 로그인 필요 여부를 검사할 때 로그인된 세션 이용해 인증 요구
@router.get("/protected")
async def protected(request: Request):
    try:
        user = request.session.get("user")
        if not user:
            return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, 
                                content={"message": "접근 불가, 로그인 필요"})
        return {"message": f"{user}님 환영합니다."}
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"message": "서버 오류", "error": str(e)})


## 로그아웃 API
@router.post("/logout")
async def logout(request: Request):
    try:
        request.session.clear()
        return {"message": "로그아웃 완료"}
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                            content={"message": "서버 오류", "error": str(e)})