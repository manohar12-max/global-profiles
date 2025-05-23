import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MapView({ lat, lng, profile ,setShowMap}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (loadError) {
      toast.error("Error loading map. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [loadError]);

  if (loadError) return null;

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64 text-blue-600">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl" />
        <span className="ml-2 text-sm text-white">Loading map...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center sm:m-4">
      <div className="w-[350px] sm:w-[600px] h-[400px] rounded-xl shadow-md overflow-hidden">
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={{ lat, lng }}
          zoom={13}
          options={{
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          <Marker
            position={{ lat, lng }}
            onClick={() => setShowInfo(!showInfo)}
          />
          {showInfo && (
            <InfoWindow
              position={{ lat, lng }}
              onCloseClick={() => setShowInfo(false)}
            >
              <div className="w-56">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover mb-2"
                />
                <h3 className="text-base font-semibold">{profile.name}</h3>
                <p className="text-sm text-gray-600">{profile.address}</p>
              </div>
            </InfoWindow>
          )}
          <button
            onClick={() => setShowMap(false)}
            className="absolute top-4 right-5  text-black rounded-full  shadow-md z-10 cursor-pointer bg-white "
          >
            ❌
          </button>
        </GoogleMap>
      </div>
    </div>
  );
}
