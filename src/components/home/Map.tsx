"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x.src || markerIcon2x,
    iconUrl: markerIcon.src || markerIcon,
    shadowUrl: markerShadow.src || markerShadow,
});

const FixedMapComponent = () => {
    const fixedPosition: LatLngExpression = [10.841412097713482, 106.8100010126096];

    return (
        <div>
            <hr />
            <h4 className="text-2xl font-bold my-4 text-nowrap text-accent uppercase">
                Vị trí của chúng tôi
            </h4>
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
