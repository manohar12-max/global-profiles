import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/UserContext";
import api from "../../../api/api";
import { FaSpinner } from "react-icons/fa";

export default function ProfileForm({ profile, onClose }) {
  const { user } = useUserContext();

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        photo: profile.photo || "",
        description: profile.description || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "",
        zipCode: profile.zipCode || "",
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const token = user.token;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (profile) {
        await api.put(`/profile/${profile._id}`, formData, config);
        toast.success("Profile updated successfully.");
      } else {
        await api.post("/profile/create", formData, config);
        toast.success("Profile created successfully.");
      }

      onClose();
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-md w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-2">
        {profile ? "Edit Profile" : "Add New Profile"}
      </h2>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          ["Name", "name"],
          ["Photo URL", "photo"],
          ["Address", "address"],
          ["City", "city"],
          ["State", "state"],
          ["Country", "country"],
          ["ZipCode", "zipCode"],
        ].map(([label, name]) => (
          <div key={name}>
            <label className="block text-sm font-medium">{label}</label>
            <input
              type="text"
              name={name}
              required={name === "name"}
              value={formData[name]}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded text-sm"
            />
          </div>
        ))}

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            rows={2}
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded text-sm"
          />
        </div>

        <div className="sm:col-span-2 flex justify-between mt-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded flex items-center gap-2"
          >
            {submitting && <FaSpinner className="animate-spin" />}
            {submitting
              ? "Saving..."
              : profile
              ? "Update Profile"
              : "Add Profile"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-sm px-4 py-1.5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
