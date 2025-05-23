
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
 const userRoute=require("./routes/userRoute")
const profileRoute=require("./routes/profileRoutes")
dotenv.config(); 

const app = express();


app.use(cors()); //Cross-Origin Resource Sharing (CORS) — which is essential when your frontend and backend are hosted on different domains, ports, or protocols.
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello Global Profiles!');
  });
  
app.use("/api/auth",userRoute)
app.use("/api/profile",profileRoute)
app.use((req, res) => {
  res.status(404).send("Route Not Found");
});


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
