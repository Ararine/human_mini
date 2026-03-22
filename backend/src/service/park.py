
from model import park_handler
from util.database import SessionLocal


# 공원 정보 조회
async def get_park(keyword : str, coordinate : list[float]):
    
    db = SessionLocal()
    try:
        parks = await park_handler.get_park(db=db, keyword=keyword, coordinate=coordinate)   
        return parks
    except Exception as e:
        print(e)
        return None
    finally :
        db.close()

# 미구현 소스
# async def get_park(keyword : str):
    
#     db = SessionLocal()
#     try:
#         (parks, feature_collection) = await park_handler.get_park(db=db, keyword=keyword)   
#         return (parks, feature_collection)
#     except Exception as e:
#         print(e)
#         return None
#     finally :
#         db.close()