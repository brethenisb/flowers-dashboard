import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { db } from './database/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Path normalization middleware for Vercel routing
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

app.use(cors());
app.use(bodyParser.json());

// 1. System Status
app.get('/api/status', (req, res) => {
  res.json({ status: 'online', time: new Date() });
});

// 2. Inventory Management
app.get('/api/inventory', async (req, res) => {
  try {
    const items = await db.getInventory();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await db.updateInventoryItem(id, req.body);
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Customer Management
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await db.getCustomers();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and Email are required' });
    
    const newCustomer = {
      id: 'c' + (Math.floor(Math.random() * 9000) + 1000),
      name,
      email,
      phone: phone || '',
      loyaltyPoints: 10, // Sign up bonus
      joinedDate: new Date().toISOString().split('T')[0]
    };
    
    const result = await db.addCustomer(newCustomer);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Order Management (with side-effects like inventory deduction and payments)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await db.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerId, customerName, items, customizations, paymentMethod } = req.body;
    
    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Invalid order request. Name and items are required.' });
    }

    // Determine customer ID
    let finalCustId = customerId;
    if (!finalCustId) {
      // Find existing customer by name or make a new one
      const customers = await db.getCustomers();
      const existing = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase());
      if (existing) {
        finalCustId = existing.id;
      } else {
        // Create new customer
        const newCust = await db.addCustomer({
          id: 'c' + (Math.floor(Math.random() * 9000) + 1000),
          name: customerName,
          email: customerName.toLowerCase().replace(/\s+/g, '') + '@bloomcraft.com',
          phone: '+1-555-' + Math.floor(Math.random() * 9000000 + 1000000),
          loyaltyPoints: 0,
          joinedDate: new Date().toISOString().split('T')[0]
        });
        finalCustId = newCust.id;
      }
    }

    // Deduct stock and verify pricing
    let total = 0;
    const inventory = await db.getInventory();
    
    for (const item of items) {
      const dbItem = inventory.find(inv => inv.name === item.name || inv.id === item.id);
      if (dbItem) {
        const itemQty = Number(item.qty);
        total += dbItem.price * itemQty;
        // Deduct inventory stock
        const newStock = Math.max(0, dbItem.stock - itemQty);
        await db.updateInventoryItem(dbItem.id, { stock: newStock });
      } else {
        // Fallback pricing if custom bouquet flower not in db
        total += (item.price || 2.0) * Number(item.qty);
      }
    }

    // Round total
    total = Math.round(total * 100) / 100;

    const orderId = 'o' + (Math.floor(Math.random() * 90000) + 10000);
    const dateStr = new Date().toISOString();

    const newOrder = {
      id: orderId,
      customerId: finalCustId,
      customerName,
      items,
      customizations: customizations || {},
      total,
      status: 'Pending',
      paymentStatus: paymentMethod ? 'Paid' : 'Pending',
      paymentMethod: paymentMethod || 'Cash',
      deliveryPersonnel: 'Pending',
      deliveryStatus: 'Pending',
      createdAt: dateStr
    };

    const orderResult = await db.createOrder(newOrder);

    // Side effect 1: Add Loyalty Points (1 point per dollar spent)
    const pointsGained = Math.floor(total);
    await db.updateCustomerPoints(finalCustId, pointsGained);

    // Side effect 2: Add payment transaction record
    const paymentId = 'p_' + (paymentMethod || 'cash').toLowerCase() + '_' + Math.random().toString(36).substr(2, 9);
    await db.addPayment({
      id: paymentId,
      orderId,
      amount: total,
      status: paymentMethod ? 'Succeeded' : 'Pending',
      method: paymentMethod || 'Cash',
      date: dateStr
    });

    res.status(201).json({ order: orderResult, paymentId, pointsGained });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await db.updateOrder(id, req.body);
    if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
    
    // If order was cancelled, restore inventory stock
    if (req.body.status === 'Cancelled') {
      const inventory = await db.getInventory();
      for (const item of updatedOrder.items) {
        const dbItem = inventory.find(inv => inv.name === item.name);
        if (dbItem) {
          await db.updateInventoryItem(dbItem.id, { stock: dbItem.stock + Number(item.qty) });
        }
      }
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Payment Records
app.get('/api/payments', async (req, res) => {
  try {
    const payments = await db.getPayments();
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedPayment = await db.updatePaymentStatus(id, status);
    if (!updatedPayment) return res.status(404).json({ error: 'Payment record not found' });
    res.json(updatedPayment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Reviews & Feedback
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await db.getReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const { customerName, rating, comment } = req.body;
    if (!customerName || !rating) return res.status(400).json({ error: 'Name and Rating are required' });
    
    const newReview = {
      id: 'r' + (Math.floor(Math.random() * 9000) + 1000),
      customerName,
      rating: Number(rating),
      comment: comment || '',
      date: new Date().toISOString().split('T')[0]
    };
    
    const result = await db.addReview(newReview);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Dynamic Sales Analytics
app.get('/api/analytics', async (req, res) => {
  try {
    const orders = await db.getOrders();
    const inventory = await db.getInventory();
    
    // Filter completed or active orders
    const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
    
    // Revenue calculations
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrdersCount = orders.length;
    
    // Calculate daily revenue for last 7 days
    const dailyRev = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyRev[dateStr] = 0;
    }
    
    paidOrders.forEach(o => {
      const dateStr = o.createdAt.split('T')[0];
      if (dailyRev[dateStr] !== undefined) {
        dailyRev[dateStr] += o.total;
      }
    });

    const salesTrend = Object.keys(dailyRev).map(date => ({
      date,
      revenue: Math.round(dailyRev[date] * 100) / 100
    }));

    // Calculate best selling flowers
    const flowerSales = {};
    paidOrders.forEach(o => {
      o.items.forEach(item => {
        flowerSales[item.name] = (flowerSales[item.name] || 0) + Number(item.qty);
      });
    });

    const bestSellers = Object.keys(flowerSales).map(name => ({
      name,
      value: flowerSales[name]
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    // Calculate low stock items alert count
    const lowStockCount = inventory.filter(item => item.stock <= item.minStock).length;

    // Build inventory chart dataset
    const stockStatus = inventory.map(item => ({
      name: item.name,
      stock: item.stock,
      minStock: item.minStock
    }));

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrdersCount,
      lowStockCount,
      salesTrend,
      bestSellers,
      stockStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Run Express
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 BloomCraft Backend running on http://localhost:${PORT}`);
  });
}

export default app;
