from model import history_handler
from util.database import SessionLocal


# 회원 등록  
def add_search_query(keyword : str, username : str):
    
    db = SessionLocal()
    try:
        success = history_handler.insert_search_query(db=db, username=username ,query=keyword)   
        return success
    except Exception as e:
        print(e)
        return False
    finally :
        db.close()
        