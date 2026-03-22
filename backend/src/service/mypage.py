import bcrypt
from sqlalchemy import text
from util.database import engine
from service.user_service import get_user_from_db


# 회원 정보 일부 수정
def update_user(
    username: str,
    email: str | None,
    phone_number: str | None,
    password: str | None,
    telecom_provider: str | None,
) -> bool:
    # 사용자 존재 여부 확인
    user = get_user_from_db(username)
    if not user:
        return False

    # 변경할 항목만 동적으로 SET 절 구성
    fields = {}
    if email is not None:
        fields["email"] = email
    if phone_number is not None:
        fields["phone_number"] = phone_number
    if password is not None:
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        fields["hashed_password"] = hashed.decode('utf-8')
    if telecom_provider is not None:
        fields["telecom_provider"] = telecom_provider

    if not fields:
        return False  # 수정할 내용 없음

    # SET 절 동적 생성 (예: "email = :email, phone_number = :phone_number")
    set_clause = ", ".join([f"{key} = :{key}" for key in fields])
    fields["username"] = username  # WHERE 조건용

    query = text(f"UPDATE users SET {set_clause} WHERE username = :username")
    with engine.begin() as conn:
        conn.execute(query, fields)
        
    user = get_user_from_db(username)
    return user


# 회원 탈퇴
def delete_user(username: str) -> bool:
    user = get_user_from_db(username)
    if not user:
        return False

    query = text("DELETE FROM users WHERE username = :username")
    with engine.begin() as conn:
        conn.execute(query, {"username": username})
    return True