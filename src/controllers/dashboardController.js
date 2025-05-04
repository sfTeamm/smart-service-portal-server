const Student = require('../models/Student');
const Lecture = require('../models/Lecture');
const Booking = require('../models/Booking');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Message = require('../models/Message');
const Room = require('../models/Room');
const Class = require('../models/Class');
const Module = require('../models/Module');
const Notice = require('../models/Notice');

module.exports.getDashboardStats = async (req, res) => {
  try {
    const [
      studentCount,
      lectureCount,
      totalBookings,
      pendingBookings,
      approvedBookings,
      maintenancePending,
      maintenanceInProgress,
      maintenanceResolved,
      messageCount,
      roomCount,
      classCount,
      moduleCount,
      noticeCount,
    ] = await Promise.all([
      Student.countDocuments(),
      Lecture.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'approved' }),
      MaintenanceRequest.countDocuments({ status: 'Pending' }),
      MaintenanceRequest.countDocuments({ status: 'In Progress' }),
      MaintenanceRequest.countDocuments({ status: 'Resolved' }),
      Message.countDocuments(),
      Room.countDocuments(),
      Class.countDocuments(),
      Module.countDocuments(),
      Notice.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents: studentCount,
        totalLectures: lectureCount,
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
        },
        maintenanceRequests: {
          pending: maintenancePending,
          inProgress: maintenanceInProgress,
          resolved: maintenanceResolved,
        },
        totalMessages: messageCount,
        totalRooms: roomCount,
        totalClasses: classCount,
        totalModules: moduleCount,
        totalNotices: noticeCount,
      }
    });

  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
  }
};
