import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths for JSON file database
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const SEED_FILE = path.join(DATA_DIR, 'seed.json');

// MongoDB Environment Variable
const MONGODB_URI = process.env.MONGODB_URI || null;
let useMongo = false;

// Mongoose Schemas (if using MongoDB)
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
  id: String,
  name: String,
  stock: Number,
  price: Number,
  supplier: String,
  minStock: Number
});

const CustomerSchema = new Schema({
  id: String,
  name: String,
  email: String,
  phone: String,
  loyaltyPoints: Number,
  joinedDate: String
});

const OrderSchema = new Schema({
  id: String,
  customerId: String,
  customerName: String,
  items: Array,
  customizations: Object,
  total: Number,
  status: String,
  paymentStatus: String,
  paymentMethod: String,
  deliveryPersonnel: String,
  deliveryStatus: String,
  createdAt: String
});

const ReviewSchema = new Schema({
  id: String,
  customerName: String,
  rating: Number,
  comment: String,
  date: String
});

const PaymentSchema = new Schema({
  id: String,
  orderId: String,
  amount: Number,
  status: String,
  method: String,
  date: String
});

let InventoryModel, CustomerModel, OrderModel, ReviewModel, PaymentModel;

// Try to connect to MongoDB if URI is supplied
if (MONGODB_URI) {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✨ Connected successfully to MongoDB!');
    useMongo = true;
    
    InventoryModel = mongoose.model('Inventory', InventorySchema);
    CustomerModel = mongoose.model('Customer', CustomerSchema);
    OrderModel = mongoose.model('Order', OrderSchema);
    ReviewModel = mongoose.model('Review', ReviewSchema);
    PaymentModel = mongoose.model('Payment', PaymentSchema);
    
    // Seed MongoDB if empty
    const invCount = await InventoryModel.countDocuments();
    if (invCount === 0) {
      console.log('🌱 Seeding MongoDB database...');
      const seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
      await InventoryModel.insertMany(seedData.inventory);
      await CustomerModel.insertMany(seedData.customers);
      await OrderModel.insertMany(seedData.orders);
      await ReviewModel.insertMany(seedData.reviews);
      await PaymentModel.insertMany(seedData.payments);
      console.log('🌱 Seeded MongoDB database successfully!');
    }
  } catch (err) {
    console.warn('⚠️ MongoDB Connection Failed. Falling back to local JSON database.', err.message);
    useMongo = false;
  }
}

// Local JSON file DB Helper functions
function readJsonDb() {
  if (!fs.existsSync(DB_FILE)) {
    // Seed from seed.json
    if (fs.existsSync(SEED_FILE)) {
      const data = fs.readFileSync(SEED_FILE, 'utf-8');
      fs.writeFileSync(DB_FILE, data, 'utf-8');
      return JSON.parse(data);
    }
    const emptyDb = { inventory: [], customers: [], orders: [], reviews: [], payments: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(emptyDb, null, 2), 'utf-8');
    return emptyDb;
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error("Error reading JSON db, returning seed values", e);
    const seed = JSON.parse(fs.readFileSync(SEED_FILE, 'utf-8'));
    return seed;
  }
}

function writeJsonDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Ensure the local JSON DB is seeded on startup
if (!useMongo) {
  readJsonDb();
  console.log('📂 Operating in Zero-Dependency Local JSON Mode. File database active.');
}

// Unified API Export
export const db = {
  // Inventory
  async getInventory() {
    if (useMongo) {
      return await InventoryModel.find({});
    } else {
      return readJsonDb().inventory;
    }
  },
  
  async updateInventoryItem(id, fields) {
    if (useMongo) {
      return await InventoryModel.findOneAndUpdate({ id }, { $set: fields }, { new: true });
    } else {
      const dbData = readJsonDb();
      const idx = dbData.inventory.findIndex(item => item.id === id);
      if (idx !== -1) {
        dbData.inventory[idx] = { ...dbData.inventory[idx], ...fields };
        writeJsonDb(dbData);
        return dbData.inventory[idx];
      }
      return null;
    }
  },

  // Customers
  async getCustomers() {
    if (useMongo) {
      return await CustomerModel.find({});
    } else {
      return readJsonDb().customers;
    }
  },

  async addCustomer(customer) {
    if (useMongo) {
      const newCust = new CustomerModel(customer);
      return await newCust.save();
    } else {
      const dbData = readJsonDb();
      dbData.customers.push(customer);
      writeJsonDb(dbData);
      return customer;
    }
  },

  async updateCustomerPoints(id, points) {
    if (useMongo) {
      return await CustomerModel.findOneAndUpdate({ id }, { $inc: { loyaltyPoints: points } }, { new: true });
    } else {
      const dbData = readJsonDb();
      const idx = dbData.customers.findIndex(c => c.id === id);
      if (idx !== -1) {
        dbData.customers[idx].loyaltyPoints += points;
        writeJsonDb(dbData);
        return dbData.customers[idx];
      }
      return null;
    }
  },

  // Orders
  async getOrders() {
    if (useMongo) {
      return await OrderModel.find({}).sort({ createdAt: -1 });
    } else {
      // Sort newest first
      const orders = readJsonDb().orders;
      return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  },

  async createOrder(order) {
    if (useMongo) {
      const newOrder = new OrderModel(order);
      return await newOrder.save();
    } else {
      const dbData = readJsonDb();
      dbData.orders.push(order);
      writeJsonDb(dbData);
      return order;
    }
  },

  async updateOrder(id, fields) {
    if (useMongo) {
      return await OrderModel.findOneAndUpdate({ id }, { $set: fields }, { new: true });
    } else {
      const dbData = readJsonDb();
      const idx = dbData.orders.findIndex(o => o.id === id);
      if (idx !== -1) {
        dbData.orders[idx] = { ...dbData.orders[idx], ...fields };
        writeJsonDb(dbData);
        return dbData.orders[idx];
      }
      return null;
    }
  },

  // Reviews
  async getReviews() {
    if (useMongo) {
      return await ReviewModel.find({}).sort({ date: -1 });
    } else {
      const reviews = readJsonDb().reviews;
      return [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  async addReview(review) {
    if (useMongo) {
      const newReview = new ReviewModel(review);
      return await newReview.save();
    } else {
      const dbData = readJsonDb();
      dbData.reviews.push(review);
      writeJsonDb(dbData);
      return review;
    }
  },

  // Payments
  async getPayments() {
    if (useMongo) {
      return await PaymentModel.find({}).sort({ date: -1 });
    } else {
      const payments = readJsonDb().payments;
      return [...payments].sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },

  async addPayment(payment) {
    if (useMongo) {
      const newPayment = new PaymentModel(payment);
      return await newPayment.save();
    } else {
      const dbData = readJsonDb();
      dbData.payments.push(payment);
      writeJsonDb(dbData);
      return payment;
    }
  },

  async updatePaymentStatus(id, status) {
    if (useMongo) {
      return await PaymentModel.findOneAndUpdate({ id }, { $set: { status } }, { new: true });
    } else {
      const dbData = readJsonDb();
      const idx = dbData.payments.findIndex(p => p.id === id);
      if (idx !== -1) {
        dbData.payments[idx].status = status;
        writeJsonDb(dbData);
        return dbData.payments[idx];
      }
      return null;
    }
  }
};
