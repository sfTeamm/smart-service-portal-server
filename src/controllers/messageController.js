const Message = require('../models/Message');
const Student = require('../models/Student');
const Lecture = require('../models/Lecture');

module.exports = {
  sendMessageToLecture: async (req, res) => {
    try {
      const { studentId, lectureId, message } = req.body;

      const student = await Student.findById(studentId);
      const lecture = await Lecture.findById(lectureId);

      if (!student || !lecture) {
        return res.status(404).json({
          success: false,
          message: "Student or Lecture not found",
        });
      }

      const newMessage = new Message({
        sender: { id: student._id, model: 'Student' },
        receiver: { id: lecture._id, model: 'Lecture' },
        message: message.trim(),
      });

      await newMessage.save();

      return res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      });
    } catch (err) {
      console.error("Error sending message to lecture:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while sending message",
      });
    }
  },

  sendMessageToStudent: async (req, res) => {
    try {
      const { lectureId, studentId, message } = req.body;

      const student = await Student.findById(studentId);
      const lecture = await Lecture.findById(lectureId);

      if (!student || !lecture) {
        return res.status(404).json({
          success: false,
          message: "Student or Lecture not found",
        });
      }

      const newMessage = new Message({
        sender: { id: lecture._id, model: 'Lecture' },
        receiver: { id: student._id, model: 'Student' },
        message: message.trim(),
      });

      await newMessage.save();

      return res.status(200).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage,
      });
    } catch (err) {
      console.error("Error sending message to student:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while sending message",
      });
    }
  },

  getMessagesForStudent: async (req, res) => {
    try {
      const studentId = req.params.studentId;

      const messages = await Message.find({ 'receiver.id': studentId })
      .populate('sender.id', 'name email')
      .populate('receiver.id', 'name email')
      .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (err) {
      console.error("Error fetching messages for student:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching messages",
      });
    }
  },

  getMessagesForLecture: async (req, res) => {
    try {
      const lectureId = req.params.lectureId;

      const messages = await Message.find({ 'receiver.id': lectureId })
        .populate('sender.id', 'name email')
        .populate('receiver.id', 'name email')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Messages retrieved successfully",
        data: messages,
      });
    } catch (err) {
      console.error("Error fetching messages for lecture:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching messages",
      });
    }
  },

  getSentMessagesByLecture: async (req, res) => {
    try {
      const lectureId = req.params.lectureId;
  
      const messages = await Message.find({ 
        'sender.id': lectureId, 
        'sender.model': 'Lecture' 
      })
      .populate('sender.id', 'name email')
      .populate('receiver.id', 'name email')
      .sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        message: "Messages sent by lecture retrieved successfully",
        data: messages,
      });
    } catch (err) {
      console.error("Error fetching sent messages for lecture:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching sent messages",
      });
    }
  },  
  getSentMessagesByStudent: async (req, res) => {
    try {
      const studentId = req.params.studentId;
  
      const messages = await Message.find({ 
        'sender.id': studentId, 
        'sender.model': 'Student' 
      })
      .populate('sender.id', 'name email')
      .populate('receiver.id', 'name email')
      .sort({ createdAt: -1 });
  
      return res.status(200).json({
        success: true,
        message: "Messages sent by student retrieved successfully",
        data: messages,
      });
    } catch (err) {
      console.error("Error fetching sent messages for student:", err);
      return res.status(500).json({
        success: false,
        message: "Server error while fetching sent messages",
      });
    }
  },  

  
};
