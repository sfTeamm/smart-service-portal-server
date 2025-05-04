const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { userId, userType } = req.params;

    const notifications = await Notification.find({
      'recipient.id': userId,
      'recipient.recipientModel': userType
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
