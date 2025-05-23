import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import MapView from "./MapView";
import { useNavigate } from "react-router-dom";
export default function ProfileCard({ profile }) {

  const [showMap, setShowMap] = useState(false);
 
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center border-2 border-gray-300 ">
      <div
        onClick={() => navigate(`/profile/${profile._id}`)}
        className="cursor-pointer w-full flex flex-col items-center"
      >
        <img
          src={profile.photo}
          alt={profile.name}
          className="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-center">{profile.name}</h2>
        <p className="text-sm text-gray-600 text-center mb-4">
           {profile.description.length > 30
                    ? `${profile.description.substring(0, 30)}...read more`
                    : profile.description}
        </p>
      </div>
      {(profile.location || profile.address) && (
        <button
          onClick={() => setShowMap(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition duration-200 cursor-pointer"
        >
          <FaMapMarkerAlt />
          Summary
        </button>
      )}

     

      {showMap  && (
        <div className="fixed inset-0 bg-blue-800/70 z-50 flex items-center justify-center p-4">
          <div className="relative">
           
            <MapView
              setShowMap={setShowMap}
              lat={profile.location.lat}
              lng={profile.location.lng}
              profile={profile}
            />
          </div>
        </div>
      )}
    </div>
  );
}
