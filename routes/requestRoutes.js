const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests
} = require("../controllers/requestController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createRequest);
router.get("/my", authMiddleware, getMyRequests);

module.exports = router;