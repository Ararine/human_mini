from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func, Numeric
from table.park import Park

import json
from geoalchemy2 import Geography
from geoalchemy2.functions import ST_AsGeoJSON, ST_FlipCoordinates

# feature 변환시켜주는 helper 함수
# def to_feature(geometry, properties=None):
#     return {
#         "type": "Feature",
#         "properties": properties or {},
#         "geometry": geometry
#     }

# featureCollection 변환시켜주는 helper 함수
# def to_feature_collection(features):
#     return {
#         "type": "FeatureCollection",
#         "features": features
#     }

#  SQLAlchemy 객체를 딕셔너리로 변환 
async def get_park(db: Session, keyword: str, coordinate : list[float]):
    """
    1. 검색된 데이터 기준 중앙값 계산(center_sub)
    2. 받아온 좌표 기준으로 distance 계산(distance)
    3. 거리, 이름순으로 정렬하여 조회된 모든 데이터 반환
    4. 모든 기본 컬럼은 getattr로 자동 딕셔너리화
    5. geom(공간정보) ST_AsGeoJSON으로 변환하여 'location' 키에 병합
    6. center(검색된 데이터의 중간 좌표) ST_AsGeoJSON으로 변환하여 'center' 키에 병합
    7. 계산된 distance 컬럼 'distance' 키에 병합
    8. list 데이터로 반환
    """
    try:
        # 서브 쿼리
        center_sub = (
                db.query(
                    func.ST_SetSRID(
                        func.ST_MakePoint(
                            func.AVG(func.ST_X(Park.geom)),
                            func.AVG(func.ST_Y(Park.geom))
                    ),
                    4326
                )
            )
            .filter(Park.park_name.like(f'%{keyword}%'))
            .scalar_subquery()
        )
        
        # 거리
        distance = func.ROUND(
                (func.ST_Distance(
                        func.ST_FlipCoordinates(Park.geom).cast(Geography),
                        func.ST_MakePoint(coordinate[0], coordinate[1]).cast(Geography)
                    ) / 1000).cast(Numeric), 2).label("distance")
        
        # 쿼리 실행
        # ST_FlipCoordinates : 좌표 x, y -> y, x 로 변환
        data = db.query(
                Park,
                ST_AsGeoJSON(ST_FlipCoordinates(Park.geom)).label('geom_json'),
                ST_AsGeoJSON(ST_FlipCoordinates(center_sub)).label('center_json'),
                distance
            ).filter(Park.park_name.like(f"%{keyword}%")
            ).order_by(distance, Park.park_name).all()
            
        parks = []
        
        for row in data :
            park_obj, geom_json, center_json, distance = row

            # __table__.columns를 순회하며 'geom' 컬럼만 제외하고 모두 담음
            park_dict = {
                col.name: getattr(park_obj, col.name)
                for col in park_obj.__table__.columns
                if col.name != 'geom'
            }

            # json.loads를 통해 문자열을 실제 파이썬 딕셔너리/리스트 구조로 변환
            park_dict['location'] = json.loads(geom_json) if geom_json else None
            park_dict['center'] = json.loads(center_json) if center_json else None
            
            # 거리 컬럼 추가
            park_dict['distance'] = float(distance) if distance else None

            # 공원 기본 정보 추가
            parks.append(park_dict)
            
        return parks
    except SQLAlchemyError as e:
        print(f"Read Park Error: {e}")
        return None

# 미구현 소스(폴리곤)    
# async def get_park(db: Session, keyword: str):
#     """
#     1. 이름순으로 정렬하여 조회된 모든 데이터 반환
#     2. 모든 기본 컬럼은 getattr로 자동 딕셔너리화
#     3. geom(공간정보)만 ST_AsGeoJSON으로 변환하여 'location' 키에 병합
#     4. list 데이터로 반환
#     """
#     try:
#         data = db.query(
#             Park,
#             ST_AsGeoJSON(ST_FlipCoordinates(Park.geom)).label('geom_json'),
#             ST_AsGeoJSON(ST_FlipCoordinates(Park.poly_geom)).label('poly_geom_json')
#             ).filter(Park.park_name.like(f"%{keyword}%")
#         ).order_by(Park.park_name).all()
            
#         parks = []
#         features = []
        
#         for row in data :
#             park_obj, geom_json, poly_geom_json = row

#             # __table__.columns를 순회하며 'geom' 컬럼만 제외하고 모두 담음
#             park_dict = {
#                 col.name: getattr(park_obj, col.name)
#                 for col in park_obj.__table__.columns
#                 if col.name != 'geom' and col.name != 'poly_geom'
#             }

#             # json.loads를 통해 문자열을 실제 파이썬 딕셔너리/리스트 구조로 변환
#             park_dict['location'] = json.loads(geom_json) if geom_json else None
#             park_dict['geometry'] = json.loads(poly_geom_json) if poly_geom_json else None
        
#             # 공원 기본 정보 추가
#             parks.append(park_dict)
            
#             # geometry 데이터 추가
#             id = getattr(park_obj, "id")
#             park_name = getattr(park_obj, "park_name")
            
#             # react-leaflet 에서 GeoJson 컴포넌트를 사용하기 위해 
#             # featureCollection 변환이 필요
#             # featureCollection 을 만들기 위한 기초 작업
#             feature = to_feature(park_dict['geometry'], {
#                 "id": id,
#                 "name" : park_name
#                 })
            
#             features.append(feature)
        
#         feature_collection = to_feature_collection(features)
            
#         return parks, feature_collection
#     except SQLAlchemyError as e:
#         print(f"Read Park Error: {e}")
#         return None