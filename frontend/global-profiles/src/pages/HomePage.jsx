import React, { useState, useEffect } from "react";
import ProfileCard from "../components/ProfileCard";
import { CiSearch } from "react-icons/ci";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import LocationSelector from "../components/locationSelector";

export default function Home() {
  const [search, setSearch] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile");
        const data = await response.json();

        if (response.ok) {
          setProfiles(data.data);
        } else {
          toast.error(data.message || "Failed to fetch profiles.");
          console.error("Fetch error:", data.message);
        }
      } catch (error) {
        toast.error("Network error: Unable to fetch profiles.");
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((profile) => {
    const matchSearch = search
      ? profile.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchCountry = selectedCountry?.name
      ? profile.country === selectedCountry?.name
      : true;

    const matchState = selectedState?.name
      ? profile.state === selectedState?.name
      : true;

    const matchCity = selectedCity ? profile.city === selectedCity : true;

    return matchSearch && matchCountry && matchState && matchCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4 text-primary text-center">
        Explore Profiles
      </h1>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search profiles by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg shadow-sm"
          />
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
        </div>

        <LocationSelector
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </div>

      {loading ? (
        <div className="text-center text-muted flex items-center justify-center gap-2 py-10">
          <FaSpinner className="animate-spin text-blue-500 text-xl" />
          <span>Loading profiles...</span>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <p className="text-center text-muted py-10">No profiles match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <ProfileCard key={profile._id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
