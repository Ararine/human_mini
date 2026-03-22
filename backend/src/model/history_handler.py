from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.sql import func
from table import SearchHistory
from table import Park

import json
from geoalchemy2.functions import ST_AsGeoJSON, ST_FlipCoordinates

#  SQLAlchemy 객체를 딕셔너리로 변환 
def history_to_dict(row):
    if row is None:
        return None
    # {컬렴명 : 속성값}
    return {column.name: getattr(row, column.name) for column in row.__table__.columns}

def insert_search_query(db: Session, username: str, query: str) -> bool:
    """
    특정 유저의 검색 기록을 생성
    [SQL]: INSERT INTO search_histories (user_id, search_query, created_at) VALUES (...)
    """
    try:
        db_history = SearchHistory(
            username=username,
            search_query=query
        )
        db.add(db_history)
        db.commit() #DB 확정 저장
        return True
    except SQLAlchemyError as e:
        print(f"Insert Search History Error: {e}")
        db.rollback()
        return False

# [READ] 특정 유저의 '삭제되지 않은' 검색 기록 전체 조회
def get_user_search_histories(db: Session, username: str) -> list[dict]:
    """
    특정 유저(PK)의 기록 중 del_yn이 'N'인 것만 최신순으로 가져오기
    [실행되는 SQL]
    SELECT * FROM search_histories sh
    LEFT OUTER JOIN parks p
    on sh.search_query = p.park_name
    WHERE user_id = :user_id AND del_yn = 'N' 
    ORDER BY created_at DESC;
    """
    try:
        data = db.query(
            SearchHistory,
            Park.address,
            # ST_AsGeoJSON(ST_FlipCoordinates(Park.geom)).label('geom_json'),
            ).outerjoin(
                Park, SearchHistory.search_query == Park.park_name).filter(
            SearchHistory.username == username,
            SearchHistory.del_yn == "N"
        ).order_by(SearchHistory.created_at.desc()).all()
                
        histories = []
        
        for row in data :
            
            SearchHistory_obj, address = row
            # SearchHistory_obj, address, geom_json = row
            
            # __table__.columns를 순회하며 모두 담음
            history_dict = {
                col.name: getattr(SearchHistory_obj, col.name)
                for col in SearchHistory_obj.__table__.columns
            }

            history_dict['address'] = address
            # json.loads를 통해 문자열을 실제 파이썬 딕셔너리/리스트 구조로 변환
            # history_dict['location'] = json.loads(geom_json) if geom_json else None

            # 검색 기록 정보 추가
            histories.append(history_dict)
        
        return histories
    except SQLAlchemyError as e:
        print(f"Read Search History Error: {e}")
        return []

# [DELETE] 검색 기록 '소프트 삭제' (단일 항목)
def soft_delete_history(db: Session, history_id: int) -> bool:
    """
    사용자가 기록을 지워도 DB에는 남겨두되, 서비스상에서는 안 보이게 처리
    [실행되는 SQL]
    1. 대상 조회: SELECT * FROM search_histories WHERE id = :history_id LIMIT 1;
    2. 소프트 삭제 실행: 
    UPDATE search_histories 
    SET del_yn = 'Y', deleted_at = NOW() 
    WHERE id = :history_id;
    """
    try:
        db_history = db.query(SearchHistory).filter(SearchHistory.id == history_id).first()
        if db_history:
            db_history.del_yn = "Y"           # 삭제 여부 플래그 변경
            db_history.deleted_at = func.now() # 삭제 시점 기록
            db.commit() # 이 시점에 UPDATE 쿼리가 실행됩니다.
            return True
        return False
    except SQLAlchemyError as e:
        print(f"Soft Delete Error: {e}")
        db.rollback()
        return False

# [DELETE] 특정 유저의 히스토리 전체 '소프트 삭제' (일괄 처리)
def soft_delete_all_user_history(db: Session, username: str) -> bool:
    """
    설명: 유저가 '검색 기록 전체 삭제' 버튼을 눌렀을 때 사용
    [실행되는 SQL]
    UPDATE search_histories 
    SET del_yn = 'Y', deleted_at = NOW() 
    WHERE user_id = :user_id AND del_yn = 'N';
    """
    try:
        db.query(SearchHistory).filter(
            SearchHistory.username == username,
            SearchHistory.del_yn == "N"
        ).update({
            "del_yn": "Y",
            "deleted_at": func.now()
        }, synchronize_session=False) # 대량 업데이트 성능 최적화
        db.commit()
        return True
    except SQLAlchemyError as e:
        print(f"Soft all_delete error : {e}")
        db.rollback()
        return False