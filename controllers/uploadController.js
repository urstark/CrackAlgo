import Upload from '../models/Upload.js';
import path from 'path';
import fs from 'fs';

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const upload = await Upload.create({
      userId: req.user._id,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.body.fileType || 'project',
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    res.redirect('/dashboard');
  } catch (error) {
    res.status(400).json({ message: 'Upload failed' });
  }
};

export const getUserUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(uploads);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch uploads' });
  }
};

export const getAllUploads = async (req, res) => {
  try {
    const uploads = await Upload.find()
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(uploads);
  } catch (error) {
    res.status(400).json({ message: 'Failed to fetch uploads' });
  }
};