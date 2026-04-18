const express = require("express");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(express.json());

app.use("/api/requests", requestRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});