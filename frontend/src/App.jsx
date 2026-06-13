import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import BouquetBuilder from './pages/BouquetBuilder';
import { 
  Customers, Orders, Inventory, Delivery, 
  Analytics, Revenue, Reviews, Payments, Notifications, Admin 
} from './pages/OtherPages';

// Robust local mock fallback database in case backend API isn't running
const MOCK_DATA = {
  inventory: [
    { id: "f1", name: "Red Rose", stock: 120, price: 2.50, supplier: "Green Valley Growers", minStock: 30 },
    { id: "f2", name: "Pink Rose", stock: 95, price: 2.50, supplier: "Green Valley Growers", minStock: 30 },
    { id: "f3", name: "White Tulip", stock: 18, price: 1.80, supplier: "Dutch Petals Co.", minStock: 25 },
    { id: "f4", name: "Yellow Tulip", stock: 40, price: 1.80, supplier: "Dutch Petals Co.", minStock: 25 },
    { id: "f5", name: "Stargazer Lily", stock: 35, price: 4.00, supplier: "Orchid Oasis Ltd.", minStock: 15 },
    { id: "f6", name: "Sweet Lavender", stock: 150, price: 1.20, supplier: "Provence Farms", minStock: 40 },
    { id: "f7", name: "Bright Sunflower", stock: 12, "price": 3.00, supplier: "Sunny Slopes Inc.", minStock: 20 },
    { id: "f8", name: "Blue Hydrangea", stock: 25, "price": 5.50, supplier: "Pacific Flora", minStock: 15 },
    { id: "f9", name: "Pink Carnation", stock: 80, "price": 1.50, supplier: "Green Valley Growers", minStock: 25 }
  ],
  customers: [
    { id: "c1", name: "Eleanor Vance", email: "eleanor@gmail.com", phone: "+1-202-555-0143", loyaltyPoints: 450, joinedDate: "2025-09-15" },
    { id: "c2", name: "James Sterling", email: "jsterling@yahoo.com", phone: "+1-303-555-0189", loyaltyPoints: 120, joinedDate: "2026-01-20" },
    { id: "c3", name: "Sophia Martinez", email: "sophia.m@outlook.com", phone: "+1-415-555-0122", loyaltyPoints: 780, joinedDate: "2025-05-11" },
    { id: "c4", name: "Liam Henderson", email: "liam.h@gmail.com", phone: "+1-617-555-0195", loyaltyPoints: 90, joinedDate: "2026-03-02" },
    { id: "c5", name: "Clara Dupont", email: "clara.d@live.com", phone: "+1-718-555-0156", loyaltyPoints: 310, joinedDate: "2025-11-30" }
  ],
  orders: [
    {
      id: "o1001",
      customerId: "c1",
      customerName: "Eleanor Vance",
      items: [
        { name: "Red Rose", qty: 12, price: 2.50 },
        { name: "Sweet Lavender", qty: 10, price: 1.20 }
      ],
      customizations: { size: "Medium", wrapping: "Rustic Burlap", greetingCard: "Happy Anniversary, my love! - Arthur" },
      total: 42.00,
      status: "Delivered",
      paymentStatus: "Paid",
      paymentMethod: "Stripe",
      deliveryPersonnel: "Robert Davis",
      deliveryStatus: "Completed",
      createdAt: "2026-06-08T14:30:00Z"
    },
    {
      id: "o1002",
      customerId: "c3",
      customerName: "Sophia Martinez",
      items: [
        { name: "Blue Hydrangea", qty: 3, price: 5.50 },
        { name: "White Tulip", qty: 10, price: 1.80 }
      ],
      customizations: { size: "Large", wrapping: "Elegant Pink Crepe", greetingCard: "Hope this brightens your week! Love, Sophia" },
      total: 34.50,
      status: "In Transit",
      paymentStatus: "Paid",
      paymentMethod: "Razorpay",
      deliveryPersonnel: "Sarah Jenkins",
      deliveryStatus: "Out for Delivery",
      createdAt: "2026-06-11T08:15:00Z"
    },
    {
      id: "o1003",
      customerId: "c2",
      customerName: "James Sterling",
      items: [
        { name: "Bright Sunflower", qty: 5, price: 3.00 },
        { name: "Yellow Tulip", qty: 5, price: 1.80 }
      ],
      customizations: { size: "Small", wrapping: "Classic Kraft Paper", greetingCard: "Happy Birthday, Dad!" },
      total: 24.00,
      status: "Processing",
      paymentStatus: "Paid",
      paymentMethod: "Stripe",
      deliveryPersonnel: "Pending",
      deliveryStatus: "Pending",
      createdAt: "2026-06-11T10:00:00Z"
    }
  ],
  reviews: [
    { id: "r1", customerName: "Eleanor Vance", rating: 5, comment: "The anniversary bouquet was absolutely breath-taking! Fresh and arrived right on time.", date: "2026-06-08" },
    { id: "r2", customerName: "Marcus Aurelius", rating: 4, comment: "Great selection of custom flowers, though the yellow tulips ran out of stock. Overall good experience.", date: "2026-06-09" },
    { id: "r3", customerName: "Sophia Martinez", rating: 5, comment: "Exceptional customer support! The bridal setup was exactly as envisioned.", date: "2026-06-10" }
  ],
  payments: [
    { id: "p_stripe_01", orderId: "o1001", amount: 42.00, status: "Succeeded", method: "Stripe", date: "2026-06-08T14:31:00Z" },
    { id: "p_razor_02", orderId: "o1002", amount: 34.50, status: "Succeeded", method: "Razorpay", date: "2026-06-11T08:16:00Z" },
    { id: "p_stripe_03", orderId: "o1003", amount: 24.00, status: "Succeeded", method: "Stripe", date: "2026-06-11T10:01:00Z" }
  ],
  notifications: [
    { id: "n1", title: "⚠️ Stock Alert: White Tulip", description: "White Tulip stock is 18 stems, which is below the minimum limit of 25 stems.", time: new Date(Date.now() - 3600000).toISOString(), read: false, category: 'inventory' },
    { id: "n2", title: "🛍️ New Custom Order: o1003", description: "James Sterling purchased a Small Custom Bouquet for $24.00.", time: new Date(Date.now() - 7200000).toISOString(), read: false, category: 'order' },
    { id: "n3", title: "🚴 Courier Dispatched", description: "Sarah Jenkins is out for delivery with order o1002.", time: new Date(Date.now() - 10800000).toISOString(), read: true, category: 'delivery' }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [backendOnline, setBackendOnline] = useState(false);

  // Fetch all data
  const loadAllData = async () => {
    try {
      // Check status first
      const statusRes = await fetch('/api/status');
      if (statusRes.ok) {
        setBackendOnline(true);
        
        const [invRes, ordRes, custRes, payRes, revRes, anaRes] = await Promise.all([
          fetch('/api/inventory'),
          fetch('/api/orders'),
          fetch('/api/customers'),
          fetch('/api/payments'),
          fetch('/api/reviews'),
          fetch('/api/analytics')
        ]);

        if (invRes.ok) setInventory(await invRes.json());
        if (ordRes.ok) setOrders(await ordRes.json());
        if (custRes.ok) setCustomers(await custRes.json());
        if (payRes.ok) setPayments(await payRes.json());
        if (revRes.ok) setReviews(await revRes.json());
        if (anaRes.ok) setAnalytics(await anaRes.json());
      } else {
        throw new Error('Backend offline');
      }
    } catch (e) {
      console.warn("⚠️ API error. Falling back to local frontend mock data storage.", e.message);
      setBackendOnline(false);
      
      // Load from localStorage or mock defaults
      const localStore = localStorage.getItem('bloomcraft_store');
      if (localStore) {
        const stored = JSON.parse(localStore);
        setInventory(stored.inventory);
        setOrders(stored.orders);
        setCustomers(stored.customers);
        setPayments(stored.payments);
        setReviews(stored.reviews);
        setNotifications(stored.notifications || MOCK_DATA.notifications);
      } else {
        setInventory(MOCK_DATA.inventory);
        setOrders(MOCK_DATA.orders);
        setCustomers(MOCK_DATA.customers);
        setPayments(MOCK_DATA.payments);
        setReviews(MOCK_DATA.reviews);
        setNotifications(MOCK_DATA.notifications);
      }
    }
  };

  // Sync to local storage for persistent testing in mock mode
  useEffect(() => {
    if (!backendOnline && inventory.length > 0) {
      localStorage.setItem('bloomcraft_store', JSON.stringify({
        inventory, orders, customers, payments, reviews, notifications
      }));
    }
  }, [inventory, orders, customers, payments, reviews, notifications, backendOnline]);

  useEffect(() => {
    loadAllData();
  }, []);

  // Compute metrics for analytics when in mock mode
  useEffect(() => {
    if (!backendOnline && orders.length > 0) {
      const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
      const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);
      
      // Calculate daily trends
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

      // Best sellers
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

      const stockStatus = inventory.map(item => ({
        name: item.name,
        stock: item.stock,
        minStock: item.minStock
      }));

      setAnalytics({
        totalRevenue,
        totalOrdersCount: orders.length,
        salesTrend,
        bestSellers,
        stockStatus
      });
    }
  }, [orders, inventory, backendOnline]);

  // Actions
  const handlePlaceOrder = async (orderData) => {
    if (backendOnline) {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Failed to create order');
      await loadAllData();
    } else {
      // Mock flow
      const orderId = 'o' + (Math.floor(Math.random() * 90000) + 10000);
      const dateStr = new Date().toISOString();
      let total = 0;
      
      // Deduct stock
      const updatedInv = inventory.map(flower => {
        const item = orderData.items.find(i => i.name === flower.name);
        if (item) {
          total += flower.price * item.qty;
          return { ...flower, stock: Math.max(0, flower.stock - item.qty) };
        }
        return flower;
      });

      // Add premiums
      const sizeCost = orderData.customizations.size === 'Small' ? 3.00 : orderData.customizations.size === 'Medium' ? 6.00 : 9.00;
      total += sizeCost + 3.50; // wrapping
      if (orderData.customizations.greetingCard) total += 1.50;
      total = Math.round(total * 100) / 100;

      // Add to orders
      const newOrder = {
        id: orderId,
        customerId: 'c' + (Math.floor(Math.random() * 9000) + 1000),
        customerName: orderData.customerName,
        items: orderData.items,
        customizations: orderData.customizations,
        total,
        status: 'Pending',
        paymentStatus: 'Paid',
        paymentMethod: orderData.paymentMethod || 'Stripe',
        deliveryPersonnel: 'Pending',
        deliveryStatus: 'Pending',
        createdAt: dateStr
      };

      // Register payment
      const paymentId = 'p_mock_' + Math.random().toString(36).substr(2, 9);
      const newPayment = {
        id: paymentId,
        orderId,
        amount: total,
        status: 'Succeeded',
        method: orderData.paymentMethod || 'Stripe',
        date: dateStr
      };

      // Add notifications
      const newNotice = {
        id: 'n_' + Date.now(),
        title: `🛍️ New Bouquet Order: ${orderId}`,
        description: `${orderData.customerName} ordered custom flowers for $${total}.`,
        time: dateStr,
        read: false,
        category: 'order'
      };

      setInventory(updatedInv);
      setOrders([newOrder, ...orders]);
      setPayments([newPayment, ...payments]);
      setNotifications([newNotice, ...notifications]);

      // Check stock alert for low items
      updatedInv.forEach(flower => {
        if (flower.stock <= flower.minStock) {
          const alertNotice = {
            id: 'n_low_' + flower.id + '_' + Date.now(),
            title: `⚠️ Stock Alert: ${flower.name}`,
            description: `${flower.name} stock level is ${flower.stock}, below safety minimum of ${flower.minStock}.`,
            time: new Date().toISOString(),
            read: false,
            category: 'inventory'
          };
          setNotifications(prev => [alertNotice, ...prev]);
        }
      });
    }
  };

  const handleUpdateOrder = async (orderId, fields) => {
    if (backendOnline) {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) await loadAllData();
    } else {
      // Mock flow
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          // Send notification on status transitions
          if (fields.status && fields.status !== o.status) {
            const notice = {
              id: 'n_status_' + Date.now(),
              title: `📦 Order ${orderId} is now ${fields.status}`,
              description: `Status changed to ${fields.status} for ${o.customerName}'s order.`,
              time: new Date().toISOString(),
              read: false,
              category: fields.status === 'Cancelled' ? 'inventory' : 'delivery'
            };
            setNotifications(prev => [notice, ...prev]);
          }
          return { ...o, ...fields };
        }
        return o;
      });
      setOrders(updatedOrders);
    }
  };

  const handleUpdateStock = async (itemId, fields) => {
    if (backendOnline) {
      const res = await fetch(`/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) await loadAllData();
    } else {
      // Mock flow
      const updatedInv = inventory.map(item => {
        if (item.id === itemId) {
          return { ...item, ...fields };
        }
        return item;
      });
      setInventory(updatedInv);
    }
  };

  const handleAddCustomer = async (custData) => {
    if (backendOnline) {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(custData)
      });
      if (res.ok) await loadAllData();
    } else {
      // Mock flow
      const newCust = {
        id: 'c' + (Math.floor(Math.random() * 9000) + 1000),
        name: custData.name,
        email: custData.email,
        phone: custData.phone,
        loyaltyPoints: 10,
        joinedDate: new Date().toISOString().split('T')[0]
      };
      setCustomers([...customers, newCust]);
    }
  };

  const handleAddReview = async (revData) => {
    if (backendOnline) {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(revData)
      });
      if (res.ok) await loadAllData();
    } else {
      // Mock flow
      const newReview = {
        id: 'r' + (Math.floor(Math.random() * 9000) + 1000),
        customerName: revData.customerName,
        rating: Number(revData.rating),
        comment: revData.comment,
        date: new Date().toISOString().split('T')[0]
      };
      setReviews([newReview, ...reviews]);
    }
  };

  const handleUpdatePayment = async (paymentId, fields) => {
    if (backendOnline) {
      const res = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      });
      if (res.ok) await loadAllData();
    } else {
      // Mock flow
      const updatedPay = payments.map(p => {
        if (p.id === paymentId) {
          if (fields.status === 'Refunded') {
            // Cancel matching order
            handleUpdateOrder(p.orderId, { status: 'Cancelled', paymentStatus: 'Refunded', deliveryStatus: 'Cancelled' });
          }
          return { ...p, ...fields };
        }
        return p;
      });
      setPayments(updatedPay);
    }
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleToggleReadNotification = (id) => {
    const updated = notifications.map(n => {
      if (n.id === id) return { ...n, read: true };
      return n;
    });
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            orders={orders} 
            customers={customers} 
            inventory={inventory} 
            payments={payments}
            analytics={analytics} 
            setActiveTab={setActiveTab} 
          />
        );
      case 'customers':
        return <Customers customers={customers} onAddCustomer={handleAddCustomer} />;
      case 'orders':
        return <Orders orders={orders} onUpdateOrder={handleUpdateOrder} />;
      case 'bouquet-builder':
        return <BouquetBuilder inventory={inventory} onPlaceOrder={handlePlaceOrder} />;
      case 'inventory':
        return <Inventory inventory={inventory} onUpdateStock={handleUpdateStock} />;
      case 'delivery':
        return <Delivery orders={orders} onUpdateOrder={handleUpdateOrder} />;
      case 'analytics':
        return <Analytics orders={orders} analytics={analytics} />;
      case 'revenue':
        return <Revenue orders={orders} />;
      case 'reviews':
        return <Reviews reviews={reviews} onAddReview={handleAddReview} />;
      case 'payments':
        return <Payments payments={payments} onUpdatePayment={handleUpdatePayment} />;
      case 'notifications':
        return (
          <Notifications 
            notifications={notifications} 
            onClearAll={handleClearNotifications}
            onToggleRead={handleToggleReadNotification}
          />
        );
      case 'admin':
        return <Admin />;
      default:
        return <div>Section under construction</div>;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel Content */}
      <main className="main-content">
        {!backendOnline && (
          <div style={{
            background: 'linear-gradient(90deg, #FFF9C4 0%, #FFFDE7 100%)',
            border: '1px solid #FFE082',
            padding: '8px 24px',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#F57C00',
            fontWeight: 600,
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>🔌 Local Sandboxed Mocking active. (Start the Express server on port 5000 to enable live database syncing).</span>
            <button 
              className="btn" 
              style={{ padding: '4px 10px', fontSize: '0.75rem', background: 'var(--color-rose)', color: 'var(--color-white)' }}
              onClick={loadAllData}
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Top Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />

        {/* Tab content view */}
        <div style={{ marginTop: '20px' }}>
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
}
