from pydantic import BaseModel, EmailStr


# 아이디 찾기 인증코드 발송 요청
class FindIdRequest(BaseModel):
    email: EmailStr


# 아이디 찾기 코드 확인 요청
class FindIdVerifyRequest(BaseModel):
    email: EmailStr
    code: str

    
    
# 비밀번호 찾기 인증코드 발송 요청
class FindPasswordRequest(BaseModel):
    username: str
    email: EmailStr


# 비밀번호 찾기 코드 확인 요청
class FindPasswordVerifyRequest(BaseModel):
    email: EmailStr
    code: str
    

#  비밀번호 재설정 요청
class ResetPasswordRequest(BaseModel):
    username: str
    new_password: str
