const mongoose = require("mongoose");
const axios = require("axios");

const profileSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    address: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    location: {
      lat: { type: Number },
      lng: { type: Number },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to geocode address
profileSchema.pre("save", async function (next) {
  if (!this.isModified("address")) return next();

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(this.address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    const res = await axios.get(url);
    const data = res.data;

    if (
      data.status === "OK" &&
      data.results &&
      data.results[0]?.geometry?.location
    ) {
      this.location = {
        lat: data.results[0].geometry.location.lat,
        lng: data.results[0].geometry.location.lng,
      };
      return next();
    } else {
      return next(new Error("Invalid address. Could not fetch coordinates."));
    }
  } catch (err) {
    return next(new Error("Geocoding failed: " + err.message));
  }
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
