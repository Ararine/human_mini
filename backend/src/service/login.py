
import bcrypt
from sqlalchemy import text 

from util.database import engine
from util.database import SessionLocal
from model import user_handler

from .user_service import get_user_from_db, change_password_in_db



# 비밀번호 해시를 저장하는 '사용자 계정명' 용도
users = {
    "user": bcrypt.hashpw("password".encode('utf-8'), bcrypt.gensalt())
}

# 비밀번호 유효성 검증
def verify_user(username: str, password: str) -> bool:
    db = SessionLocal()
    try :
        user_record = user_handler.get_user(db, username=username)
        if user_record:
            stored_hash = user_record["hashed_password"] # DB에서 불러온 해시
            if isinstance(stored_hash, str):
                stored_hash = stored_hash.encode('utf-8')

            pw_bytes = password.encode('utf-8')

            return bcrypt.checkpw(pw_bytes, stored_hash)
    except Exception as e :
        print(e)
        return False
    finally :
        db.close()


# 비밀번호 변경
def change_password(username: str, old_password: str, new_password: str) -> bool:
    if verify_user(username, old_password):
        new_hash = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
        change_password_in_db(username, new_hash)  # DB 반영 함수 호출
        return True
    return False

# 구글 로그인 
def check_user_exists(email: str, name: str) -> bool:
    query = text(
        """
        SELECT count(*) as n FROM users 
        WHERE email = :email AND full_name = :name
        """
    )
    with engine.connect() as conn:
        row = conn.execute(query, {"email": email, "name": name}).fetchone()
    return row[0] > 0

# 유저 정보 가져오기
def get_user(username : str) :
    db = SessionLocal()
    try :
        user_record = user_handler.get_user(db, username=username)
        return user_record
    except Exception as e :
        print(e)
        return None
    finally:
        db.close()