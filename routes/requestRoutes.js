const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getRequestById,
  assignRequest,
  updateRequestStatus, 
  deleteRequest        
} = require("../controllers/requestController");

const authMiddleware = require("../middlewares/authMiddleware");

// Routes ปัจจุบัน
router.post("/", authMiddleware, createRequest);
router.get("/my", authMiddleware, getMyRequests);
router.get("/:id", authMiddleware, getRequestById);
router.put("/:id/assign", authMiddleware, assignRequest);
router.put("/:id/status", authMiddleware, updateRequestStatus);
router.delete("/:id", authMiddleware, deleteRequest);

module.exports = router;