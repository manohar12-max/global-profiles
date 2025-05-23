import React from "react";
import { useUserContext } from "../../context/UserContext";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";

export default function ProfileTable({ profiles, loading, error, onEdit, onDeleteSuccess }) {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profile?")) return;
    try {
      const token = user?.token || localStorage.getItem("token");
      await api.delete(`/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile deleted successfully!");
      onDeleteSuccess();
    } catch (err) {
      toast.error("Failed to delete profile.");
    }
  };

  if (loading) {
    return (
      <div className="text-center text-blue-600 py-8">
        <FaSpinner className="animate-spin text-3xl mx-auto mb-2" />
        Loading profiles...
      </div>
    );
  }

  if (error) {
    toast.error(error);
    return <p className="text-center text-red-500 mt-6">{error}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-[var(--color-surface)] shadow-md transition-all duration-300">
      <table className="min-w-full text-left border border-gray-200">
        <thead className="bg-[var(--color-accent)] text-[var(--color-text)]">
          <tr>
            <th className="p-3 whitespace-nowrap">Photo</th>
            <th className="p-3 whitespace-nowrap">Name</th>
            <th className="p-3 whitespace-nowrap hidden sm:table-cell">Description</th>
            <th className="p-3 whitespace-nowrap hidden md:table-cell">Address</th>
            <th className="p-3 text-center whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <tr
                key={profile._id}
                className="border-t hover:bg-[var(--color-background)] transition duration-200"
              >
                <td className="p-3">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                </td>
                <td className="p-3 font-medium text-[var(--color-text)]">{profile.name}</td>
                <td className="p-3 text-sm text-[var(--color-muted)] hidden sm:table-cell">
                  {profile.description.length > 30
                    ? `${profile.description.substring(0, 30)}...`
                    : profile.description}
                </td>
                <td className="p-3 text-sm text-[var(--color-muted)] hidden md:table-cell">
                  {profile.address.length > 30
                    ? `${profile.address.substring(0, 30)}...`
                    : profile.address}
                </td>
                <td className="p-3 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => navigate(`/profile/${profile._id}`)}
                    className="bg-blue-500 hover:bg-blue-600 transition text-white px-1 md:px-3 md:py-1 rounded text-sm shadow"
                  >
                    <span className=""><MdRemoveRedEye /></span>
                
                  </button>
                  <button
                    onClick={() => onEdit(profile)}
                    className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-1 md:px-3 md:py-1 rounded text-sm shadow"
                  >
                    
                    <span className=""><MdEdit /></span>
                  </button>
                  <button
                    onClick={() => handleDelete(profile._id)}
                    className="bg-[var(--color-danger)] hover:bg-red-600 transition text-white px-1 md:px-3 md:py-1 rounded text-sm shadow"
                  >
                   
                    <span className=""><MdDelete /></span>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-[var(--color-muted)] py-6">
                No profiles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
