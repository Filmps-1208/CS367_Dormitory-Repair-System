const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const authMiddleware = require("../middlewares/authMiddleware");

// 👉 POST /api/auth/login
router.post("/login", (req, res) => {
    console.log("BODY:", req.body); // 🔥 debug

    // ✅ กันพังกรณี body ไม่มี
    const id = req.body?.id;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "กรุณาระบุ id"
        });
    }

    try {
        const staffPath = path.join(__dirname, "../data/staff.json");
        console.log("PATH:", staffPath);
        console.log("EXISTS:", fs.existsSync(staffPath));

        const raw = fs.readFileSync(staffPath, "utf8");
        const staffData = JSON.parse(raw);

        const user = staffData.find(s => String(s.id) === String(id));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "ไม่พบผู้ใช้งาน"
            });
        }

        return res.json({
            success: true,
            message: "เข้าสู่ระบบสำเร็จ",
            data: {
                user,
                token: user.id
            }
        });

    } catch (err) {
        console.error("ERROR:", err.message);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// 👉 GET /api/auth/me
router.get("/me", authMiddleware, (req, res) => {
    return res.json({
        success: true,
        data: req.user
    });
});

module.exports = router;