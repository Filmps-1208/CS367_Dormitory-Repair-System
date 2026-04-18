const fs = require('fs');
const path = require('path');

function authMiddleware(req, res, next) {
  const mockStaffId = req.headers['x-mock-staff-id'];

  if (mockStaffId) {
    const staffPath = path.join(__dirname, '../data/staff.json');
    const staffData = JSON.parse(fs.readFileSync(staffPath, 'utf8'));
    const staffMember = staffData.find(staff => staff.id === mockStaffId);

    if (staffMember) {
      req.user = staffMember; 
    } else {
      return res.status(401).json({ success: false, message: "ไม่พบข้อมูลเจ้าหน้าที่รหัสนี้" });
    }
  } else {
    req.user = {
      id: 101,
      name: "Student A",
      role: "student"
    };
  }

  next();
}

module.exports = authMiddleware;