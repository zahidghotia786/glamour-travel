"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapLocation({ latitude, longitude, googleMapUrl }) {
  const lat = Number(latitude);
  const lng = Number(longitude);
  const [locationName, setLocationName] = useState("");
  const hasCoordinates = !isNaN(lat) && !isNaN(lng);

  // 🧠 Fetch location name from OpenStreetMap Nominatim API
  useEffect(() => {
    if (!hasCoordinates) return;

    const fetchLocationName = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
        );
        const data = await res.json();
        if (data?.display_name) {
          setLocationName(data.display_name);
        } else if (data?.address) {
          // fallback to composing from address parts
          const { city, town, village, state, country } = data.address;
          setLocationName(
            [city || town || village, state, country].filter(Boolean).join(", ")
          );
        }
      } catch (err) {
        console.error("Failed to fetch location name:", err);
      }
    };

    fetchLocationName();
  }, [lat, lng, hasCoordinates]);

  if (!hasCoordinates) {
    // fallback to Google Map URL only
    if (googleMapUrl) {
      return (
        <div className="space-y-4">
          <iframe
            src={googleMapUrl}
            className="w-full h-64 rounded-lg border"
            loading="lazy"
            allowFullScreen
          />
        </div>
      );
    }
    return <p className="text-gray-500">Location not available.</p>;
  }

  return (
    <div className="space-y-4">
      {locationName && (
        <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold text-blue-800">
            📍 {locationName}
          </h3>
        </div>
      )}

      <div className="w-full h-64 rounded-lg overflow-hidden border">
        <MapContainer
          center={[lat, lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>
              <div className="text-sm">
                <strong>{locationName || "Selected Location"}</strong>
                <br />
                Lat: {lat}, Lng: {lng}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-3 rounded-lg border">
        <p>
          <span className="font-semibold text-blue-800">Latitude:</span> {lat}
        </p>
        <p>
          <span className="font-semibold text-blue-800">Longitude:</span> {lng}
        </p>
        {googleMapUrl && (
          <a
            href={googleMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline mt-2 sm:mt-0"
          >
            View in Google Maps →
          </a>
        )}
      </div>
    </div>
  );
}
