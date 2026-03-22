import { useState } from "react";
import "../css/MapCard.css";

export default function MapCard({ item, handleParkClick }) {
  const [isCardError, setIsCardError] = useState(false);

  return (
    <>
      <div
        className="place-card"
        key={item.key_id}
        onClick={() => handleParkClick(item)}
      >
        <div className="place-card-header">
          <div className="place-title">{item.park_name}</div>
          <div className="place-distance">
            {item.distance >= 1
              ? item.distance + " km"
              : item.distance * 1000 + " m"}
          </div>
        </div>
        <div className="place-card-main">
          <div className="place-address-wrap">
            <div className="place-address">{item.address}</div>
          </div>
          <div className="image-card-box">
            <div className="image-item">
              <img
                src={item.image_url ?? "/image_error.jpg"}
                alt={item.park_name}
                // className={isCardError ? "img error" : "img"}
                className={"img"}
                onError={(e) => {
                  setIsCardError(true);
                  e.target.src = "/image_error.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
