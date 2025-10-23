"use client";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CustomMap() {
  const position = [25.033, 121.5654]; // 台北101
  const path = [
    [25.033, 121.5654],
    [25.0478, 121.5319],
  ];

  return (
    <MapContainer center={position} zoom={14} style={{ height: "500px", width: "100%" }}>
      {/* 地圖底圖 */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 標點 */}
      <Marker position={position} />
      {/* 路徑 */}
      <Polyline positions={path} color="red" />
    </MapContainer>
  );
}
