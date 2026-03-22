import React, { useState, useEffect, useRef } from "react";
import { getPark } from "../api/park";
import MainHeader from "../components/MainHeader";
import { Icon, divIcon, point } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import MapSideBarLayer from "../components/MapSideBarLayer";

import "leaflet/dist/leaflet.css";
import "../css/Map.css";

export default function Map() {
  /////////////////////////////////////////////////////////////////////////////////////
  // 검색
  // 공원 데이터
  const [parkData, setParkData] = useState([]);
  const [selParkData, setSelParkData] = useState([]);

  // 지도
  // 좌표 데이터
  const [coordinate, setCoordinate] = useState([37.5665, 126.978]); // 서울 중심좌표

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      setCoordinate([position.coords.latitude, position.coords.longitude]);
    });
  }, []);
  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.setView(coordinate, 15);
    }
  }, [coordinate]);

  // 사이드 바
  // 사이드 바 리스트
  const [mainOpen, setMainOpen] = useState(false);
  // 사이드 바 디테일
  const [detailOpen, setDetailOpen] = useState(false);
  // 버튼 활성화 여부
  const [btnActive, setBtnActive] = useState(false);
  // 검색 여부
  const [IsSearch, setIsSearch] = useState(false);
  // 지난 열림 상태 기억
  const [lastOpenState, setLastOpenState] = useState({
    mainOpen: true,
    detailOpen: false,
  });

  const mapRef = useRef(null);

  // 초기화 하기 위해서 iconUrl과 iconSize 필요
  // 마커 아이콘
  const treeIcon = new Icon({
    iconUrl: require("../assets/marker-icon.png"),
    iconSize: [38, 38],
  });

  // 현재 위치 아이콘
  const currentPositionIcon = new Icon({
    iconUrl: require("../assets/current-marker-icon.png"),
    iconSize: [64, 64],
  });

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// search 함수 //////////////////////////////////////
  // 키보드 누를시 작동하는 함수
  const handleKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      var _keyword = e.target.value ? e.target.value : "";
      searchPark(_keyword); // 랜더링 미진행으로 keyword 값을 가져올 수 없음
    }
  };

  // 검색 버튼 클릭시 작동하는 함수
  const handleClickSearch = (_keyword) => {
    searchPark(_keyword); // 랜더링 미진행으로 keyword 값을 가져올 수 없음
  };

  // 검색창에 검색어 입력 후 Enter 키 혹은 검색 버튼 클릭시 작동하는 훅
  const searchPark = async (_keyword) => {
    const res = await getPark(_keyword, coordinate);
    setParkData(res.data.parks);
    setIsSearch(true);
    setDetailOpen(false);
  };

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// map 함수 //////////////////////////////////////
  const createCustomClusterIcon = (cluster) => {
    return new divIcon({
      html: `<div class="cluster-icon">${cluster.getChildCount()}`,
      className: "custom-marker-cluster",
      iconSize: point(33, 33, true),
    });
  };

  const moveMap = (_coordinate) => {
    const map = mapRef.current;

    if (map) {
      map.flyTo(_coordinate, 16);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// 사이드바 함수 //////////////////////////////////////

  // 전체 토글 버튼
  const handleToggleAll = () => {
    if (btnActive) {
      // 현재 상태 저장
      setLastOpenState({
        mainOpen,
        detailOpen,
      });

      // 둘 다 닫기
      setMainOpen(false);
      setDetailOpen(false);

      setBtnActive(false);
    } else {
      // 이전 상태 복원
      setMainOpen(lastOpenState.mainOpen);
      setDetailOpen(lastOpenState.detailOpen);

      setBtnActive(true);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// 공통 함수 //////////////////////////////////////

  const handleParkClick = (item) => {
    setMainOpen(lastOpenState.mainOpen);
    setDetailOpen(true);
    moveMap(item.location.coordinates);
    setSelParkData(item);
  };

  useEffect(() => {
    const map = mapRef.current;

    // 첫 조회 이후 사이드 바 열기 위한 조건
    if (IsSearch) {
      setMainOpen(true);
      setBtnActive(true);
    }

    // 조회 데이터 있을 때만 조회 데이터 중간 위치로 이동
    if (parkData.length > 0 && map)
      map.flyTo(parkData[0].center.coordinates, 12);
  }, [parkData]);
  /////////////////////////////////////////////////////////////////////////////////////

  // console.log("selParkData", selParkData);

  return (
    <div>
      <div className="home-header">
        <MainHeader
          handleKeyDownSearch={handleKeyDownSearch}
          handleClickSearch={handleClickSearch}
        />
      </div>

      <div className="home-main leaflet-map-area">
        <MapContainer
          center={coordinate}
          zoom={15}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OpenStreetMap</a>'
            url={`https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${process.env.REACT_APP_JAWG_ACCESS_TOKEN}`}
          />
          <MarkerClusterGroup
            chunkedLoading // 순차적 로딩
            iconCreateFunction={createCustomClusterIcon} // 아이콘 설정
          >
            <Marker
              position={coordinate}
              icon={currentPositionIcon}
              eventHandlers={{
                click: () => moveMap(coordinate),
                mouseover: (e) => e.target.openPopup(),
                mouseout: (e) => e.target.closePopup(),
              }}
            >
              <Popup closeButton={false}>현재 위치</Popup>
            </Marker>
            {parkData.map((item) => (
              <Marker
                key={item.id}
                position={item.location.coordinates}
                icon={treeIcon}
                eventHandlers={{
                  click: () => handleParkClick(item),
                  mouseover: (e) => e.target.openPopup(),
                  mouseout: (e) => e.target.closePopup(),
                }}
              >
                <Popup closeButton={false}>{item.park_name}</Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>

      <div className="home-sidebar">
        <MapSideBarLayer
          parkData={parkData}
          selParkData={selParkData}
          mainOpen={mainOpen}
          detailOpen={detailOpen}
          handleParkClick={handleParkClick}
          handleToggleAll={handleToggleAll}
        ></MapSideBarLayer>
      </div>
    </div>
  );
}

// export default function Map() {
//   // const [keyword, setKeyword] = useState("");
//   const [changeKeyword, setChangeKeyword] = useState("");
//   const [parkData, setParkData] = useState([]);
//   const [featureCollection, setFeatureCollection] = useState({});

//   // 키보드 누를시 작동하는 함수
//   const handleKeyDownSearch = (e) => {
//     if (e.key === "Enter") {
//       // setKeyword(e.target.value);
//       searchPark(e.target.value); // 랜더링 미진행으로 keyword 값을 가져올 수 없음
//     }
//   };

//   // 검색 버튼 클릭시 작동하는 함수
//   const handleClickSearch = () => {
//     // setKeyword(changeKeyword);
//     searchPark(changeKeyword); // 랜더링 미진행으로 keyword 값을 가져올 수 없음
//   };

//   // 검색창에 단어 입력시 작동하는 함수
//   const handleChangeKeyword = (e) => {
//     setChangeKeyword(e.target.value);
//   };

//   // 검색창에 검색어 입력 후 Enter 키 혹은 검색 버튼 클릭시 작동하는 훅
//   const searchPark = async (_keyword) => {
//     if (_keyword) {
//       const res = await getPark(_keyword);
//       setParkData(res.data.parks);
//       setFeatureCollection(res.data.feature_collection);
//     }
//   };

//   useEffect(() => {
//     if (parkData.length !== 0) {
//       console.log("parkData", parkData);
//     }
//   }, [parkData, featureCollection]);

//   return (
//     <div>
//       <div className="home-header">
//         <MainHeader
//           handleKeyDownSearch={handleKeyDownSearch}
//           handleClickSearch={handleClickSearch}
//           handleChangeKeyword={handleChangeKeyword}
//         />
//       </div>
//       <div className="home-main">
//         <div className="leaflet-map">
//           <LeafletMap
//             parkData={parkData}
//             featureCollection={featureCollection}
//           ></LeafletMap>
//         </div>

//         <div className="sidebar">
//           <div className="side-on">hello</div>
//           <div className="fold-btn">
//             <button>check</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// 미완성
// export default function LeafletMap({
//   parkData,
//   featureCollection
// }) {
//   const mapRef = useRef(null);

//   const markers = [
//     {
//       geocode: [48.86, 2.3522],
//       popUp: "Hello, I am pop up 1",
//     },
//     {
//       geocode: [48.85, 2.3522],
//       popUp: "Hello, I am pop up 2",
//     },
//     {
//       geocode: [48.855, 2.34],
//       popUp: "Hello, I am pop up 3",
//     },
//   ];

//   //초기화 하기 위해서 iconUrl과 iconSize 필요
//   const customIcon = new Icon({
//     iconUrl: require("../assets/marker-icon.png"),
//     iconSize: [38, 38],
//   });

//   const createCustomClusterIcon = (cluster) => {
//     return new divIcon({
//       html: `<div class="cluster-icon">${cluster.getChildCount()}`,
//       className: "custom-marker-cluster",
//       iconSize: point(33, 33, true),
//     });
//   };

//   const moveMap = (location) => {
//     const map = mapRef.current;

//     if (map) {
//       map.flyTo(location, 15);
//     }
//   };

//   return (
//     <>
//       <MapContainer center={[37.5665, 126.978]} zoom={12} ref={mapRef}>
//         <TileLayer
//           attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}?api_key=${process.env.REACT_APP_MAP_API_KEY}`}
//           ext="png"
//         />
//         {/* <MarkerClusterGroup
//           chunkedLoading // 순차적 로딩
//           iconCreateFunction={createCustomClusterIcon} // 아이콘 설정
//         >
//           {parkData.map((item) => (
//             <Marker
//               key={item.id}
//               position={item.location.coordinates}
//               icon={customIcon}
//               eventHandlers={{
//                 click: () => moveMap(item.location.coordinates),
//               }}
//             >
//               <Popup>{marker.popUp}</Popup>
//             </Marker>
//           ))}
//         </MarkerClusterGroup> */}
//         {/* <GeoJSON
//           data={featureCollection}
//           style={{
//             weight: 2,
//             fillColor: "green",
//             fillOpacity: 0.4,
//           }}
//           onEachFeature={(feature, layer) => {
//             layer.on({
//               click: (e) => {
//                 const map = e.target._map;
//                 map.fitBounds(e.target.getBounds());
//               },
//             });

//             layer.bindTooltip(feature.properties.LABEL, {
//               sticky: true,
//             });
//           }}
//         /> */}
//       </MapContainer>
//     </>
//   );
// }
