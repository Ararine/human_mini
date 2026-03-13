import React from "react";

function Map() {
  return (
    <div className="map-container">
      <h1>공원 지도</h1>

      <div
        style={{
          width: "100%",
          height: "500px",
          backgroundColor: "#eee",
        }}
      >
        지도 표시 영역
      </div>
    </div>
  );
}

export default Map;
