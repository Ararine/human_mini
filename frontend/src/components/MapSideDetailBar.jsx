import { useState } from "react";
import "../css/MapSideDetailBar.css";
import no_img from "../assets/image_error.jpg";

export default function MapSideDetailBar({ selParkData }) {
  const [isDetailError, setIsDetailError] = useState(false);
  const [homeActive, setHomeActive] = useState(true);
  const [infoActive, setInfoActive] = useState(false);

  const handleTapToggle = (target) => {
    if (target == "home") {
      setHomeActive(true);
      setInfoActive(false);
    } else if (target == "info") {
      setHomeActive(false);
      setInfoActive(true);
    }
  };
  // console.log("selParkData", selParkData.image_url);
  return (
    <>
      <div className="detailbar-wrap">
        <div className="detailbar-header">
          <div className="datailbar-image">
            <img
              src={selParkData.image_url ?? "/image_error.jpg"}
              alt={selParkData.park_name}
              className={isDetailError ? "img error" : "img"}
              onError={(e) => {
                setIsDetailError(true);
                e.target.src = "/image_error.jpg";
              }}
            />
          </div>
          <div className="datailbar-title">{selParkData.park_name}</div>
        </div>
        <div className="detailbar-main">
          <div className="detailbar-tab">
            <div className="detailbar-tab-home">
              <div
                className="detailbar-tab-inner br1"
                onClick={() => handleTapToggle("home")}
              >
                홈
              </div>
            </div>
            <div className="detailbar-tab-information">
              <div
                className="detailbar-tab-inner"
                onClick={() => handleTapToggle("info")}
              >
                정보
              </div>
            </div>
          </div>

          {homeActive && (
            <div className="detailbar-tab-main">
              <div className="detailbar-tab-main-inner">
                <div className="detailbar-tab-main-title">주소</div>
                <div className="detailbar-tab-main-text">
                  {selParkData.address}
                </div>
              </div>

              <div className="detailbar-tab-main-inner">
                <div className="detailbar-tab-main-title">연락처</div>
                <div className="detailbar-tab-main-text">
                  {selParkData.phone_number}
                </div>
              </div>

              {/* {selParkData.landscaping_facilities != "-" && ( */}
              <div className="detailbar-tab-main-inner">
                <div className="detailbar-tab-main-title">관광시설</div>
                <div className="detailbar-tab-main-text">
                  {selParkData.landscaping_facilities ?? "-"}
                </div>
              </div>
              {/* )} */}

              {/* {selParkData.sports_facilities != "-" && ( */}
              <div className="detailbar-tab-main-inner">
                <div className="detailbar-tab-main-title">스포츠시설</div>
                <div className="detailbar-tab-main-text">
                  {selParkData.sports_facilities ?? "-"}
                </div>
              </div>
              {/* )} */}

              {/* {selParkData.convenience_facilities != "-" && ( */}
              <div className="detailbar-tab-main-inner">
                <div className="detailbar-tab-main-title">편의시설</div>
                <div className="detailbar-tab-main-text">
                  {selParkData.convenience_facilities}
                </div>
              </div>
              {/* )} */}

              {/* {selParkData.other_facilities != "-" && ( */}
              <div className="detailbar-tab-main-inner">
                <div className="detailbar-tab-main-title">기타시설</div>
                <div className="detailbar-tab-main-text">
                  {selParkData.other_facilities}
                </div>
              </div>
              {/* )} */}
            </div>
          )}
          {infoActive && (
            <>
              <div className="detailbar-tab-info">
                <div className="detailbar-tab-info-header">소개</div>
                <div className="datailbar-tab-info-main">
                  {selParkData.description}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
