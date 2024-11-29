const Session = require('../models/session');

exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find();
    const count = await Session.countDocuments();

    if (count === 0) {
      res.status(404).json({ message: 'No sessions found for this user. No user has logged into this application yet' });
    } else {
      res.setHeader('X-Total-Count', count);
      res.json(sessions);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting sessions' });
  }
};

exports.getSessionByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const session = await Session.find({ userId: userId });
    const count = await Session.countDocuments({ userId: userId });

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
    } else {
      res.setHeader('X-Total-Count', count);
      res.json(session);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting session' });
  }
};
