const express = require("express");
const app = express();

app.use(express.json());

console.log("SERVER.JS RUNNING");

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const reportRoutes = require("./routes/reports.routes");

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/reports", reportRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});