from model import history_handler
from model import user_handler
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
        
def get_search_history_query(username : str):
    db = SessionLocal()
    try:
        user = user_handler.get_user(db, username=username)
        if user :
            histories = history_handler.get_user_search_histories(db, username=username)
            return histories
        return None
    except Exception as e :
        print(e)
        return None
    finally:
        db.close()
    
def delete_search_history_query(username : str, id : int) :
    try:
        db = SessionLocal()
        user = user_handler.get_user(db, username=username)
        if user :
            res = history_handler.soft_delete_history(db, history_id=id)
            return res
        return False
    except Exception as e :
        print(e)
        return False
    finally:
        db.close()
        
def delete_all_search_history_query(username : str) :
    try:
        db = SessionLocal()
        user = user_handler.get_user(db, username=username)
        if user :
            res = history_handler.soft_delete_all_user_history(db, username=username)
            return res
        return False
    except Exception as e :
        print(e)
        return False
    finally:
        db.close()