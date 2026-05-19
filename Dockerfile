# ดึง Base Image ของ Node.js เวอร์ชัน 20 บนระบบปฏิบัติการ Alpine
FROM node:20-alpine

# กำหนดโฟลเดอร์ทำงานหลักภายใน Container
WORKDIR /app

# คัดลอก package.json เพื่อเตรียมติดตั้งไลบรารี
COPY package*.json ./

# ติดตั้งไลบรารีเฉพาะที่จำเป็นสำหรับใช้งานจริง
RUN npm install --production

# คัดลอกไฟล์ทั้งหมดในโปรเจกต์เข้า Container
COPY . .

# เปิดพอร์ต 3000 ตามเซิร์ฟเวอร์หลัก
EXPOSE 3000

# สั่งรันระบบทันทีที่ Container เริ่มทำงาน
CMD ["npm", "start"]