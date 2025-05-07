const express = require('express');
const router = express.Router();

const { sendMessageToLecture, sendMessageToStudent, getMessagesForStudent, getMessagesForLecture,getSentMessagesByLecture, getSentMessagesByStudent } = require('../controllers/messageController');

// Route to send a message from a student to a lecture
router.post('/send-message-to-lecture', sendMessageToLecture);

// Route to send a message from a lecture to a student
router.post('/send-message-to-student', sendMessageToStudent);

// Route to get messages for a specific student
router.get('/messages-for-student/:studentId', getMessagesForStudent);

// Route to get messages for a specific lecture
router.get('/messages-for-lecture/:lectureId', getMessagesForLecture);

router.get('/sent-by-lecture/:lectureId', getSentMessagesByLecture);
router.get('/sent-by-student/:studentId', getSentMessagesByStudent);

module.exports = router;
