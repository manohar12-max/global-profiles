const Profile = require("../models/profileModal");
 const axios = require("axios");
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({})
      .sort({ createdAt: -1 })
      .populate("createdBy", "username email");

    res
      .status(200)
      .json({ success: true, count: profiles.length, data: profiles });
  } catch (error) {
    console.error("Error fetching profiles:", error.message);
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Failed to fetch profiles",
      });
  }
};

const createProfile = async (req, res) => {
  const { name, photo, description, address, country, state, zipCode, city } = req.body;

  try {
    if (!name || !description || !address || !country || !state || !zipCode || !city) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    let profile = await Profile.create({
      name,
      photo,
      description,
      address,
      country,
      state,
      zipCode,
      city,
      createdBy: req.user._id,
    });

    profile = await profile.populate("createdBy", "username email");

    return res.status(201).json({
      success: true,
      data: profile, 
    });
  } catch (error) {
    console.error("Error creating profile:", error.message);
    res.status(500).json({
      message: error.message || "Server error while creating profile",
    });
  }
};


const singleProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findById(id).populate(
      "createdBy",
      "username email"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ data: profile });
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
};

const editProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this profile" });
    }

    if (updateData.address && updateData.address !== profile.address) {
     
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const encodedAddress = encodeURIComponent(updateData.address);
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

      const geoRes = await axios.get(url);
      const geoData = geoRes.data;

      if (
        geoData.status === "OK" &&
        geoData.results &&
        geoData.results[0] &&
        geoData.results[0].geometry &&
        geoData.results[0].geometry.location
      ) {
        updateData.location = {
          lat: geoData.results[0].geometry.location.lat,
          lng: geoData.results[0].geometry.location.lng,
        };
      } else {
        return res.status(400).json({
          message: "Invalid address. Could not update location coordinates.",
        });
      }
    }

    const updatedProfile = await Profile.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "username email");

    res.status(200).json({ data: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error.message);
    res.status(500).json({ message: "Server error while updating profile" });
  }
};


const deleteProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const profile = await Profile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (profile.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this profile" });
    }

    await profile.deleteOne();

    res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error.message);
    res.status(500).json({ message: "Server error while deleting profile" });
  }
};

const adminProfiles = async (req, res) => {
  try {
    const userId = req.user._id;

    const profiles = await Profile.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .populate("createdBy", "username");

    res.status(200).json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    console.error("Error fetching author profiles:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch author's profiles",
    });
  }
};

module.exports = {
  getAllProfiles,
  createProfile,
  singleProfile,
  editProfile,
  deleteProfile,
  adminProfiles,
};
