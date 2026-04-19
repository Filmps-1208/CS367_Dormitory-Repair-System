const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

router.get("/monthly", (req, res) => {
  const filePath = path.join(__dirname, "../data/requests.json");

  let requests = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    requests = data ? JSON.parse(data) : [];
  }

  const report = {};

  requests.forEach(r => {
    const date = new Date(r.createdAt);
    const month = date.toLocaleString("en-US", { month: "long" });

    if (!report[month]) {
      report[month] = 0;
    }

    report[month]++;
  });

  res.json({
    success: true,
    data: report
  });
});

module.exports = router;