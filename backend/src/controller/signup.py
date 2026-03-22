from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from service.signup import register_user, check_duplicate_username
from schema.signup import SignupRequest, EmailCodeRequest, EmailVerifyRequest 
import util.email as email_service 

router = APIRouter()


# 회원가입 API
@router.post("/register")
async def register(data: SignupRequest):  
    try:        
        await register_user(
            username = data.username,
            password = data.password,
            full_name = data.full_name,
            email = data.email,
            gender = data.gender,
            telecom_provider = data.telecom_provider,  
            social_provider = data.social_provider,
            social_id = data.social_id,
            birth_date = data.birth_date,
            phone_number = data.phone_number
        ) 
        return JSONResponse(status_code=status.HTTP_201_CREATED, 
                            content={"message": "회원가입 완료"})
    except Exception as e:
        return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, 
                            content={"error": str(e)})
        

# 회원 가입 시 아이디 중복 확인 API 
@router.get("/check-username/{username}")
async def check_username(username:str): 
    try:
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
               
# 이메일 인증 코드 발송 API
@router.post("/send-email-code") 
async def send_email_code(data: EmailCodeRequest):     
    try:
        await email_service.send_verification_code(data.email)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "인증코드가 발송되었습니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": str(e)}
        )

# 입력된 이메일 인증 코드 유효한지 확인 API
@router.post("/verify-email-code")
async def verify_email_code(data: EmailVerifyRequest):
    try:
        is_valid = email_service.verify_code(data.email, data.code)
        if is_valid:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"isValid": True, "message": "인증 완료"}
            )
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"isValid": False, 
                     "message": "인증코드가 올바르지 않거나 만료되었습니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error": str(e)}
        )

   