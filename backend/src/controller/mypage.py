from fastapi import APIRouter, Path, Body, status
from fastapi.responses import JSONResponse
import service.mypage as mypage_service
from schema.mypage import PatchUserRequest

router = APIRouter()


# 회원 정보 수정 API
# request.form() 방식으로 데이터 받게끔 작성
async def patch_user(username: str = Path(...), data: PatchUserRequest = Body(...)):
    try:
        updated = mypage_service.update_user(
            username,
            data.email if data else None,
            data.phone_number if data else None,
            data.password if data else None
        )
        if not updated:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "수정할 회원 없음"}
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "회원 정보 수정 완료"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "수정 실패", "error": str(e)}
        )

        
# 회원 탈퇴 (DELETE)
async def delete_user(username: str = Path(...)):
    try:
        deleted = mypage_service.delete_user(username)
        if not deleted:
            return JSONResponse(
                status_code=status.HTTP_404_NOT_FOUND,
                content={"message": "삭제할 회원 없음"}
            )
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "회원 탈퇴 완료"}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"message": "탈퇴 실패", "error": str(e)}
        )
        