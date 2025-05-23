import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MapView from "../components/MapView";
import { FaMapMarkerAlt } from "react-icons/fa";
import api from "../../api/api";


export default function DetailPage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profile/${id}`);
      setProfile(res.data.data); 
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.response?.data?.message || "An error occurred while fetching the profile."
      );
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, [id]);





  if (loading)
    return (
      <p className="text-center text-gray-500 mt-10">Loading profile...</p>
    );
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-100 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col items-center text-center border border-blue-400">
        <img
          src={profile.photo || "https://via.placeholder.com/150"}
          alt={profile.name}
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-md"
        />
        <h2 className="text-3xl font-bold mt-4 text-blue-700">
          {profile.name}
        </h2>
        <p className="text-gray-600 mt-2 text-base max-w-lg">
          {profile.description}
        </p>

        <div className="mt-8 w-[80%] bg-slate-50 rounded-xl p-6 shadow-md text-left space-y-4 text-gray-800">
          <div className="flex items-center justify-between border-b   border-gray-300">
            <span className="font-semibold">🔹Country</span>
            <div className="pl-5 text-sm text-gray-600">{profile.country}</div>
          </div>
          <div className="flex items-center justify-between border-b   border-gray-300">
            <span className="font-semibold">🔹State</span>
            <div className="pl-5 text-sm text-gray-600">{profile.state}</div>
          </div>
          <div className="flex items-center justify-between border-b   border-gray-300">
            <span className="font-semibold">🔹City</span>
            <div className="pl-5 text-sm text-gray-600">{profile.city}</div>
          </div>
          <div className="flex items-center justify-between border-b   border-gray-300">
            <span className="font-semibold">🔹Zip Code</span>
            <div className="pl-5 text-sm text-gray-600">{profile.zipCode}</div>
          </div>
          <div className="flex items-center justify-between border-b   border-gray-300">
            <span className="font-semibold">🔹Address</span>
            <div className="pl-5 text-sm text-gray-600">{profile.address}</div>
          </div>
        </div>

        {(profile.address || profile.location) && (
          <button
            className="mt-8 px-6 py-2 flex items-center gap-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow"
            onClick={() => setShowMap(true)}
          >
            <FaMapMarkerAlt /> Show on Map
          </button>
        )}
      </div>

      {showMap && (
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
