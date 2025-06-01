"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { useTranslations } from "next-intl";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

const FixedMapComponent = () => {
  const t = useTranslations("map");
  const fixedPosition: LatLngExpression = [
    10.841412097713482, 106.8100010126096,
  ];

  return (
    <div>
      <h4 className="text-2xl font-bold mb-2 text-nowrap text-accent uppercase">
        {t("title")}
      </h4>
      <hr className="mb-4 border-white/30" />
      <MapContainer
        center={fixedPosition}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "200px", width: "90%", zIndex: 0 }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={fixedPosition}>
          <Popup>
            Cửa hàng của chúng tôi.
            <br />
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default FixedMapComponent;
