const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/config/dbConnect");

// Routes
const classRoute = require("./src/routes/classRoute");
const moduleRoute = require("./src/routes/moduleRoute");
const studentRoute = require("./src/routes/studentRoute");
const lectureRoutes = require("./src/routes/lectureRoutes");
const scheduleRoutes = require("./src/routes/scheduleRoute");
const noticeRoutes = require("./src/routes/noticeRoutes");
const adminRoutes = require("./src/routes/adminRoute");
const bookingRoute = require("./src/routes/bookingRoute");
const roomRoutes = require("./src/routes/roomRoute");
const messageRoutes = require("./src/routes/messageRoute");
const maintenanceRequestRoutes = require("./src/routes/maintenanceRequestRoutes");
const notificationRoutes = require('./src/routes/notificationRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');


const app = express();

app.use(cors());
app.use(express.json()); 

// API Routes
app.use("/api/class", classRoute);
app.use("/api/module", moduleRoute);
app.use("/api/student", studentRoute);
app.use("/api/lecture", lectureRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/booking", bookingRoute);
app.use("/api/rooms", roomRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/mantenance", maintenanceRequestRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

dbConnect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

