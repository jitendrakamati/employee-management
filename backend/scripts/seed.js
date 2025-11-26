import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/employee_management';

async function run() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected');

    // Ensure model registered
    const { default: m } = await import('mongoose');
    await import('../src/models/Employee.js');
    const Employee = m.model('Employee');

    // Load seed data
    const { employees: seedEmployees } = await import('../src/data/seedData.js');

    // Options: --drop (default), --append
    const args = process.argv.slice(2);
    const doAppend = args.includes('--append');

    if (!doAppend) {
      console.log('🗑️  Dropping employees collection (use --append to avoid drop)');
      await Employee.deleteMany({});
    }

    // Insert
    if (seedEmployees?.length) {
      const docs = seedEmployees.map(({ id, ...rest }) => rest);
      await Employee.insertMany(docs, { ordered: false });
    }

    const count = await Employee.countDocuments();
    console.log(`🌱 Seed complete. Employees count: ${count}`);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

run();
