import "../css/MapSideBar.css";
import MapCard from "./MapCard";

export default function MapSideBar({ parkData, handleParkClick }) {
  return (
    <>
      {parkData.length > 0 &&
        parkData.map((item) => (
          <MapCard item={item} handleParkClick={handleParkClick} />
        ))}
      {parkData.length == 0 && (
        <div className="no-data-wrap">
          <div className="no-data">검색된 데이터가 없습니다.</div>
        </div>
      )}
    </>
  );
}
