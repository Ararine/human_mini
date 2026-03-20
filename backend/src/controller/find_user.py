from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
import service.find_user as find_user_service
from schema.find_user import (
    FindIdRequest,
    FindIdVerifyRequest,
    FindPasswordRequest,
    FindPasswordVerifyRequest,
    ResetPasswordRequest
)

router = APIRouter()

# 아이디 찾기 - 가입한 이메일로 인증코드 발송
@router.post("/find-id/send-code")
async def find_id_send_code(data: FindIdRequest):
    try:
        await find_user_service.send_find_id_code(data.email)
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "인증코드가 발송되었습니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)}
        )

# 아이디 찾기 - 코드 확인 후 username 반환
@router.post("/find-id/verify-code")
async def find_id_verify_code(data: FindIdVerifyRequest):
    try:
        user_ids = find_user_service.verify_find_id_code(data.email, data.code)
        if user_ids is None:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "인증코드가 올바르지 않거나 만료되었습니다."}
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"userIds": user_ids}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)}
        )

# 비밀번호 찾기 - 인증코드 발송
@router.post("/find-password/send-code")
async def find_password_send_code(data: FindPasswordRequest):
    try:
        await find_user_service.send_find_password_code(
            data.username, data.email
        )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "인증코드가 발송되었습니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)}
        )

# 비밀번호 재설정 위한 인증 코드 확인
@router.post("/find-password/verify-code")
async def find_password_verify_code(data: FindIdVerifyRequest):
    try:
        result = find_user_service.verify_find_password_code(
            data.email, data.code
        )
        if not result:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "인증코드가 올바르지 않거나 만료되었습니다."}
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "인증 완료"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)}
        )

# 비밀번호 재설정
@router.post("/find-password/reset")
async def reset_password(data: ResetPasswordRequest):
    try:
        result = find_user_service.reset_password(
            data.username, data.new_password
        )
        if not result:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"message": "비밀번호 변경 실패"}
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "비밀번호가 변경되었습니다."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": str(e)}
        )