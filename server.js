require("dotenv").config();
const express = require("express");
const connectToDB = require("./database/db.js");
const authRoutes = require("./routes/auth-routes.js");
const homeRoutes = require('./routes/home-router.js')

connectToDB();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
