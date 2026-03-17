from fastapi import APIRouter, Request, status
from fastapi.responses import JSONResponse
from sqlalchemy import text

from service.signup import register_user
from util.database import engine  # DB 연결 
from schema.signup import SignupRequest

router = APIRouter()


# 회원가입 API
@router.post("/register")
async def register(data: SignupRequest):  
    try:
        await register_user(
            data.username, data.password, data.full_name,
            data.email, data.gender, data.birth_date,
            data.phone_number, data.telecom_provider,
            data.social_provider, data.social_id  

        )
        return JSONResponse(status_code=status.HTTP_201_CREATED, 
                            content={"message": "회원가입 완료"})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, 
                            content={"error": str(e)})