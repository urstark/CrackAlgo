import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-dashboard');
    
    // Clear existing users
    await User.deleteMany({});
    
    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      isAdmin: true
    });
    
    // Create regular user
    const user = await User.create({
      username: 'testuser',
      email: 'user@example.com',
      password: 'user123',
      isAdmin: false
    });
    
    console.log('Database seeded successfully!');
    console.log('Admin credentials: admin@example.com / admin123');
    console.log('User credentials: user@example.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();