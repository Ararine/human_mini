from util.database import SessionLocal
from model.user_handler import get_user


# username을 받아서 디비에서 유저 정보를 조회하는 함수 
def get_user_from_db(username: str):
    db = SessionLocal()
    try:
        return get_user(db, username=username)
    finally:
        db.close()  


# 비밀번호 변경  
# user_handler.py에 비밀번호 변경 함수 작성 대신 여기서 ORM 객체로 조회 후 쿼리 작성
# username과 새 비밀번호 해시를 받아서 변경
def change_password_in_db(username: str, new_hash: bytes) -> bool:
    db = SessionLocal()
    try:
        # bytes 타입인 new_hash를 문자열로 변환
        new_hash_str = new_hash.decode('utf-8')
        user = get_user(db, username=username)  # dict 형태로 유저 조회
        if not user:
            # 먼저 유저가 존재하는지 확인, 없으면 False 반환
            return False  
        from table.user import User
        user["hashed_password"] = new_hash_str
        # ORM 객체로 조회 /  ORM 쿼리 작성 부분
        db_user = db.query(User).filter(User.username == username).first()  # username이 같은 ORM 객체 조회
        db_user.hashed_password = new_hash_str  # 객체의 비밀번호 변경
        db.commit()  # 변경 비밀번호 DB에 저장 
        return True   
        print(f"Change Password Error: {e}")
        db.rollback()  # 오류 발생 시 변경사항 취소
        return False
    finally:
        db.close()  