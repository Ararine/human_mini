from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import text

from service.signup import register_user, check_duplicate_username
from util.database import engine  # DB 연결 
from schema.signup import SignupRequest

router = APIRouter()


# 회원가입 API
@router.post("/register")
async def register(data: SignupRequest):  
    try:
        await register_user(
            data.username, data.password, data.full_name,
            data.email, data.gender, data.telecom_provider,
            data.social_provider, data.social_id, 
            data.birth_date, data.phone_number
        )
        return JSONResponse(status_code=status.HTTP_201_CREATED, 
                            content={"message": "회원가입 완료"})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, 
                            content={"error": str(e)})
        

# 회원 가입 시 아이디 중복 확인 API (controller의 signup.py)
@router.get("/check-username/{username}")
async def check_username(username:str): 
    try:
        # 클라이언트에서 받은 username을 디비와 비교하여 동일한 값이 있으면 리턴
        is_duplicate = check_duplicate_username(username)
        if is_duplicate:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content = {"isDuplicate":True, "message":"이미 사용 중인 아이디입니다."}
            )
        return JSONResponse(
            status_code = status.HTTP_200_OK,
            content = {"isDuplicate":False, "messages":"사용 가능한 아이디입니다."}
        ) 
    except Exception as e:
        return JSONResponse(
            status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
            content = {"error":str(e)}
        )
               
        