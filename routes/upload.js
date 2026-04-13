import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { auth, adminAuth } from '../middleware/auth.js';
import { uploadFile, getUserUploads, getAllUploads } from '../controllers/uploadController.js';
import Upload from '../models/Upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads', req.user._id.toString());
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
  // Removed file type filter to accept all file types
});

router.post('/project', auth, upload.single('file'), uploadFile);
router.post('/media', auth, upload.single('file'), uploadFile);
router.get('/user', auth, getUserUploads);
router.get('/all', adminAuth, getAllUploads);

// Serve files securely
router.get('/file/:id', auth, async (req, res) => {
  try {
    const uploadItem = await Upload.findById(req.params.id);
    if (!uploadItem) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user owns the file or is admin
    if (!req.user.isAdmin && uploadItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.sendFile(path.resolve(uploadItem.filePath));
  } catch (error) {
    res.status(500).json({ message: 'Error serving file' });
  }
});

// Download file
router.get('/download/:id', auth, async (req, res) => {
  try {
    const uploadItem = await Upload.findById(req.params.id);
    if (!uploadItem) {
      return res.status(404).json({ message: 'File not found' });
    }
    
    // Check if user owns the file or is admin
    if (!req.user.isAdmin && uploadItem.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.download(uploadItem.filePath, uploadItem.originalName);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file' });
  }
});

export default router;