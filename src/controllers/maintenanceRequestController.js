const MaintenanceRequest = require('../models/MaintenanceRequest');
const Student = require('../models/Student');
const Lecture = require('../models/Lecture');
const Notification = require('../models/Notification');

module.exports = {
  sendMaintenanceRequest: async (req, res) => {
    try {
      const { title,senderId, senderRole, message } = req.body;

      let sender;
      if (senderRole === 'Student') {
        sender = await Student.findById(senderId);
      } else if (senderRole === 'Lecture') {
        sender = await Lecture.findById(senderId);
      }

      if (!sender) {
        return res.status(404).json({
          success: false,
          message: 'Sender not found',
        });
      }

      const newRequest = new MaintenanceRequest({
        sender: { id: sender._id, model: senderRole },
        title: title.trim(), 
        message: message.trim(),
      });

      await newRequest.save();

      return res.status(200).json({
        success: true,
        message: 'Maintenance request sent successfully',
        data: newRequest,
      });
    } catch (err) {
      console.error('Error sending maintenance request:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error while sending maintenance request',
      });
    }
  },

  getMaintenanceRequests: async (req, res) => {
    try {
      const requests = await MaintenanceRequest.find()
        .populate('sender.id', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: 'Maintenance requests retrieved successfully',
        data: requests,
      });
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      return res.status(500).json({
        success: false,
        message: 'Server error while fetching maintenance requests',
      });
    }
  },

  updateMaintenanceStatus: async (req, res) => {
    try {
      const { requestId, status } = req.body;
  
      const request = await MaintenanceRequest.findByIdAndUpdate(
        requestId,
        { status },
        { new: true, runValidators: true }
      );
  
      if (!request) {
        return res.status(404).json({ success: false, message: "Request not found" });
      }
  
      const { id, model } = request.sender;
      const title = request.title || "your request";
      const statusMessage = `Your maintenance request "${title}" is now marked as "${status}".`;
  
      await Notification.create({
        recipient: { id, recipientModel: model },
        message: statusMessage,
      });
  
      res.status(200).json({
        success: true,
        message: "Status updated and notification sent",
        data: request,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
  
};
