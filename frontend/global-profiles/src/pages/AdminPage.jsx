import React, { useEffect, useState, useCallback } from "react";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import ProfileTable from "../components/admin/ProfileTable";
import ProfileForm from "../components/admin/ProfileForm";
import api from "../../api/api";
import { IoMdLogOut } from "react-icons/io";
import { toast } from "react-toastify";

export default function AdminPage() {
  const { user, setUser } = useUserContext();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
     
      navigate("/auth");
    }
    
  }, [user, navigate]);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const token = user?.token || JSON.parse(localStorage.getItem("userInfo"))?.token;
      const res = await api.get("/profile/admin-profiles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setProfiles(res.data.data);
        setError("");
      } else {
        throw new Error("Failed to load profiles.");
      }
    } catch (err) {
      setError("Failed to load profiles.");
      toast.error("Error fetching profiles.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchProfiles();
  }, [user, fetchProfiles]);

  const handleAdd = () => {
    setSelectedProfile(null);
    setShowForm(true);
  };

  const handleEdit = (profile) => {
    setSelectedProfile(profile);
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col sm:flex-row text-[var(--color-text)] bg-[var(--color-background)]">
    
      <aside className="hidden md:block w-full sm:w-64 bg-[var(--color-primary)] text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <button
          onClick={handleAdd}
          className="w-full bg-white text-[var(--color-primary)] font-semibold py-2 rounded hover:bg-[var(--color-accent)]"
        >
          + Add Profile
        </button>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-[var(--color-danger)] hover:bg-red-600 py-2 px-4 rounded text-white font-medium"
        >
          Logout
        </button>
      </aside>

 
      <main className="flex-1 p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold">Manage Profiles</h1>
          <div className="flex gap-2 md:hidden">
            <button
              onClick={handleAdd}
              className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:bg-blue-800 text-sm"
            >
              + Add
            </button>
            <button
              onClick={handleLogout}
              className="bg-[var(--color-danger)] hover:bg-red-600 py-2 px-4 rounded text-white font-medium"
            >
              <IoMdLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <ProfileTable
          profiles={profiles}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDeleteSuccess={fetchProfiles}
        />
      </main>

    
      {showForm && (
        <div className="fixed inset-0 bg-blue-800/70 flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-xl shadow-lg w-full max-w-2xl">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-white bg-[var(--color-danger)] hover:bg-red-600 p-2 rounded-full"
            >
              ✕
            </button>
            <ProfileForm
              profile={selectedProfile}
              onClose={() => {
                setShowForm(false);
                fetchProfiles();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
