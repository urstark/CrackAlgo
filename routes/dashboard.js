import express from 'express';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Upload from '../models/Upload.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const users = await User.find({ isAdmin: false });
      const uploads = await Upload.find().populate('userId', 'username email');
      const messages = await Message.find().populate('senderId receiverId', 'username');
      
      res.render('admin-dashboard', { 
        user: req.user, 
        users, 
        uploads, 
        messages 
      });
    } else {
      const uploads = await Upload.find({ userId: req.user._id });
      const messages = await Message.find({ receiverId: req.user._id })
        .populate('senderId', 'username');
      
      res.render('user-dashboard', { 
        user: req.user, 
        uploads, 
        messages 
      });
    }
  } catch (error) {
    res.status(500).render('error', { message: 'Dashboard error' });
  }
});

export default router;