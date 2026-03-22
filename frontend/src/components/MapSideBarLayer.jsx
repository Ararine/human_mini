import MapSideBar from "./MapSideBar";
import MapSideDetailBar from "./MapSideDetailBar";
import "../css/MapSideBarLayer.css";

export default function MapSideBarLayer({
  parkData,
  selParkData,
  mainOpen,
  detailOpen,
  handleParkClick,
  handleToggleAll,
}) {
  // 버튼 방향용
  const sideOpen = mainOpen || detailOpen;

  return (
    <>
      <div
        className={`map-sidebar-layer ${mainOpen && detailOpen ? "full-open" : mainOpen || detailOpen ? "partial-open" : "close"}`}
      >
        <div className="sidebar-wrap">
          <div
            className={`sidebar-main ${mainOpen ? "main-open" : "main-close"}`}
          >
            <div className="sidebar-inner">
              <MapSideBar
                parkData={parkData}
                handleParkClick={handleParkClick}
              ></MapSideBar>
            </div>
          </div>

          <div
            className={`sidebar-detail ${detailOpen ? "detail-open" : "detail-close"}`}
          >
            <div className="sidebar-inner">
              <MapSideDetailBar selParkData={selParkData}></MapSideDetailBar>
            </div>
          </div>
        </div>

        <div className="fold-btn">
          <button onClick={handleToggleAll}>{sideOpen ? "<" : ">"}</button>
        </div>
      </div>
    </>
  );
}
