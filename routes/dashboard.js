import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

import User from '../models/User.js';
import Upload from '../models/Upload.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      const users = await User.find({ isAdmin: false });
      const uploads = await Upload.find().populate('userId', 'username email');
      const messages = await Message.find().populate('senderId receiverId', 'username');
      
      res.render('admin-dashboard', { 
        user: req.user, 
        users, 
        uploads, 
        messages 
      });
    } else if (req.user) {
      const uploads = await Upload.find({ userId: req.user._id });
      const messages = await Message.find({ receiverId: req.user._id })
        .populate('senderId', 'username');
      
      res.render('user-dashboard', { 
        user: req.user, 
        uploads, 
        messages 
      });
    } else {
      // Guest access: show all uploads but no private messages or upload forms
      const uploads = await Upload.find()
        .populate('userId', 'username')
        .sort({ createdAt: -1 });
        
      res.render('user-dashboard', { 
        user: null, 
        uploads, 
        messages: [] 
      });
    }
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).render('error', { message: 'Dashboard error' });
  }
});


export default router;