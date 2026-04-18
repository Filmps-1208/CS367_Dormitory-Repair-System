const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getRequestById,
  assignRequest
} = require("../controllers/requestController");

const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createRequest);
router.get("/my", authMiddleware, getMyRequests);

router.get("/:id", authMiddleware, getRequestById);
router.put("/:id/assign", authMiddleware, assignRequest);

module.exports = router;