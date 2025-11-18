const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Report = require('./models/Report');
const sampleReports = require('./utils/sampleData');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('connected');

  // Clear old data
  await User.deleteMany({});
  await Report.deleteMany({});

  // Create users
  const password = 'pass123';
  const hash = await bcrypt.hash(password, 10);

  await User.create({ email: 'viewer@vite.co.in', passwordHash: hash, role: 'viewer' });
  await User.create({ email: 'analyst@vite.co.in', passwordHash: hash, role: 'analyst' });

  // Insert 6 months sales data
  await Report.insertMany(sampleReports);

  console.log('Database successfully seeded ✔');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
