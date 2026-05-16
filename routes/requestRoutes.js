const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");

const {
  createRequest,
  getMyRequests,
  getRequestById,
  assignRequest,
  updateRequestStatus, 
  deleteRequest        
} = require("../controllers/requestController");

const authMiddleware = require("../middlewares/authMiddleware");


router.post("/", authMiddleware, createRequest);
router.get("/my", authMiddleware, getMyRequests);
router.post("/:id/upload", authMiddleware, upload.single("image"), (req, res) => {
  const fs = require("fs");
  const path = require("path");

  if (!req.file) {
    return res.status(400).json({ message: "กรุณาอัปโหลดไฟล์" });
  }

  const filePath = path.join(__dirname, "../data/requests.json");

  let requests = [];
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    requests = data ? JSON.parse(data) : [];
  }

  const index = requests.findIndex(r => r.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "ไม่พบ request" });
  }

  requests[index].hasImage = true;
  requests[index].image = req.file.filename;
  requests[index].updatedAt = new Date().toISOString();

  fs.writeFileSync(filePath, JSON.stringify(requests, null, 2));

res.json({
  success: true,
  message: "อัปโหลดรูปสำเร็จ",
  data: {
    file: req.file.filename,
    requestId: req.params.id
  }
  });
});
router.get("/:id", authMiddleware, getRequestById);
router.put("/:id/assign", authMiddleware, assignRequest);
router.put("/:id/status", authMiddleware, updateRequestStatus);
router.delete("/:id", authMiddleware, deleteRequest);

///////////////////////////////////////////////////////////////////////////




module.exports = router;