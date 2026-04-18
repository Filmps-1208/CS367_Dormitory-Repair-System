const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/requests.json");

function generateRequestId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

function readRequests() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
  }

  const data = fs.readFileSync(filePath, "utf8");

  if (!data.trim()) return [];

  return JSON.parse(data);
}

function writeRequests(requests) {
  fs.writeFileSync(filePath, JSON.stringify(requests, null, 2), "utf8");
}

const locationMap = {
  B: ["หอ B1","หอ B2","หอ B3","หอ B4","หอ B5","หอ B6"],
  C: ["หอ C1","หอ C2","หอ C3","หอ C4","หอ C5","หอ C6","หอ C7","หอ C8","หอ C9","หอ C10","หอ C11"],
  F: ["หอ F1","หอ F2","หอ F3","หอ F4","หอ F5"],
  M: ["หอ M1","หอ M2"],
  MED: ["หอพักแพทย์ 1"]
};

exports.createRequest = (req, res) => {
  try {
    const {
      title,
      description,
      location,
      building,
      room,
      category,
      priority,
      hasImage
    } = req.body;

    const allowedCategories = ["electrical", "plumbing", "aircon", "other"];
    const allowedPriorities = ["low", "medium", "high"];

    if (!title || !description || !location || !building || !room || !category) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกข้อมูลให้ครบ"
      });
    }

    if (!locationMap[location]) {
      return res.status(400).json({
        success: false,
        message: "location (zone) ไม่ถูกต้อง",
        allowedZones: Object.keys(locationMap)
      });
    }

    if (!locationMap[location].includes(building)) {
      return res.status(400).json({
        success: false,
        message: "building ไม่ตรงกับ location",
        allowedBuildings: locationMap[location]
      });
    }

    const roomPattern = /^[0-9]{3}$/;
    if (!roomPattern.test(room)) {
      return res.status(400).json({
        success: false,
        message: "room ต้องเป็นเลข 3 หลัก เช่น 101"
      });
    }

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "category ไม่ถูกต้อง"
      });
    }

    if (priority && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "priority ไม่ถูกต้อง"
      });
    }

    if (hasImage !== undefined && typeof hasImage !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "hasImage ต้องเป็น true หรือ false"
      });
    }

    const requests = readRequests();

    const newRequest = {
      id: generateRequestId(),
      userId: req.user.id,
      title,
      description,
      location,
      building,
      room,
      category,
      priority: priority || "medium",
      hasImage: hasImage === true, 
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    requests.push(newRequest);
    writeRequests(requests);

    return res.status(201).json({
      success: true,
      message: "สร้างคำร้องสำเร็จ",
      data: newRequest
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message
    });
  }
};

exports.getMyRequests = (req, res) => {
  try {
    const requests = readRequests();

    const myRequests = requests.filter(item => item.userId === req.user.id);

    return res.status(200).json({
      success: true,
      message: "รายการแจ้งซ่อมของฉัน",
      count: myRequests.length,
      data: myRequests
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message
    });
  }
};

// ==========================================
// GET /api/requests/:id
// ==========================================
exports.getRequestById = (req, res) => {
  try {
    const { id } = req.params;
    const requests = readRequests();
    
    const requestItem = requests.find(item => item.id === id);

    if (!requestItem) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบข้อมูลคำร้องแจ้งซ่อมรหัสนี้"
      });
    }

    return res.status(200).json({
      success: true,
      message: "รายละเอียดคำร้องแจ้งซ่อม",
      data: requestItem
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาด",
      error: error.message
    });
  }
};

// ==========================================
// PUT /api/requests/:id/assign
// ==========================================
exports.assignRequest = (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({
        success: false,
        message: "ไม่อนุญาตให้ดำเนินการ สิทธิ์เฉพาะเจ้าหน้าที่เท่านั้น"
      });
    }

    const { id } = req.params;
    const requests = readRequests();
    const index = requests.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: "ไม่พบข้อมูลคำร้องแจ้งซ่อมรหัสนี้" });
    }

    if (requests[index].status !== "pending") {
      return res.status(400).json({ success: false, message: "ไม่สามารถรับงานได้ สถานะไม่ใช่รอดำเนินการ" });
    }

    requests[index].assignee = { 
      staffId: req.user.id, 
      staffName: req.user.name 
    };
    requests[index].status = "in_progress";
    requests[index].updatedAt = new Date().toISOString();

    writeRequests(requests);

    return res.status(200).json({
      success: true,
      message: `เจ้าหน้าที่ ${req.user.name} รับงานซ่อมรหัส ${id} เรียบร้อยแล้ว`,
      data: requests[index]
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาด", error: error.message });
  }
};