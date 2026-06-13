import React, { useState, useEffect } from 'react';
import { 
  Users, ShoppingBag, Plus, Sparkles, Filter, 
  AlertTriangle, Truck, MapPin, TrendingUp, DollarSign, 
  Percent, Star, MessageSquare, CreditCard, RefreshCw, 
  Bell, BellOff, Settings, Shield, HardDrive
} from 'lucide-react';


/* ========================================================
   1. CUSTOMER MANAGEMENT
   ======================================================== */
export function Customers({ customers = [], onAddCustomer }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email) return;
    onAddCustomer({ name, email, phone });
    setName('');
    setEmail('');
    setPhone('');
  };

  const getLoyaltyBadge = (points) => {
    if (points >= 500) return <span className="badge badge-success" style={{ background: '#FFD700', color: '#5D4037' }}>🏆 Gold</span>;
    if (points >= 200) return <span className="badge badge-info" style={{ background: '#C0C0C0', color: '#37474F' }}>🥈 Silver</span>;
    return <span className="badge badge-warning" style={{ background: '#CD7F32', color: '#FFFFFF' }}>🥉 Bronze</span>;
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
      <div className="dashboard-card">
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h2>Registered Customers List</h2>
          <input 
            type="text" 
            placeholder="Search customers..." 
            className="form-control" 
            style={{ width: '220px', padding: '6px 12px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Contact Details</th>
                <th>Loyalty Points</th>
                <th>Tier Rank</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td>
                    <div>{c.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>{c.phone}</div>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--color-rose-dark)' }}>{c.loyaltyPoints} pts</td>
                  <td>{getLoyaltyBadge(c.loyaltyPoints)}</td>
                  <td>{c.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="dashboard-card">
        <h2 style={{ marginBottom: '16px' }}>Add Customer Profile</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="cust-form-name">Full Name</label>
            <input 
              id="cust-form-name"
              type="text" 
              className="form-control" 
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cust-form-email">Email Address</label>
            <input 
              id="cust-form-email"
              type="email" 
              className="form-control" 
              placeholder="e.g. john@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="cust-form-phone">Phone Number</label>
            <input 
              id="cust-form-phone"
              type="tel" 
              className="form-control" 
              placeholder="e.g. +1-555-0100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            <Plus size={16} /> Save Customer
          </button>
        </form>
      </div>
    </div>
  );
}


/* ========================================================
   2. ORDER MANAGEMENT
   ======================================================== */
export function Orders({ orders = [], onUpdateOrder }) {
  const [filter, setFilter] = useState('All');

  const getNextStatus = (current) => {
    if (current === 'Pending') return 'Processing';
    if (current === 'Processing') return 'In Transit';
    if (current === 'In Transit') return 'Delivered';
    return null;
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="dashboard-card">
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h2>Customer Order Registry</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Pending', 'Processing', 'In Transit', 'Delivered', 'Cancelled'].map(st => (
            <button 
              key={st}
              className={`btn ${filter === st ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => setFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Items & Customizations</th>
              <th>Total Amount</th>
              <th>Date Placed</th>
              <th>Order Status</th>
              <th>Payment</th>
              <th>Delivery Dispatch</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(o => {
              const nextStatus = getNextStatus(o.status);
              return (
                <tr key={o.id}>
                  <td style={{ fontWeight: 600 }}>{o.id}</td>
                  <td style={{ fontWeight: 500 }}>{o.customerName}</td>
                  <td>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {o.items.map(item => `${item.name} (x${item.qty})`).join(', ')}
                    </div>
                    {o.customizations && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', marginTop: '4px' }}>
                        📦 Wrap: {o.customizations.wrapping} • 📐 Size: {o.customizations.size}
                        {o.customizations.greetingCard && (
                          <div style={{ fontStyle: 'italic', marginTop: '2px', color: 'var(--color-rose-dark)' }}>
                            "✍️ {o.customizations.greetingCard}"
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>${Number(o.total).toFixed(2)}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${
                      o.status === 'Delivered' ? 'badge-success' : 
                      o.status === 'Cancelled' ? 'badge-danger' : 
                      o.status === 'In Transit' ? 'badge-info' : 'badge-warning'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${o.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                      {o.paymentStatus}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-sub)', marginTop: '2px', textAlign: 'center' }}>
                      {o.paymentMethod}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8rem' }}>{o.deliveryStatus}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-sub)' }}>{o.deliveryPersonnel}</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {nextStatus && (
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => onUpdateOrder(o.id, { 
                            status: nextStatus,
                            deliveryStatus: nextStatus === 'In Transit' ? 'Out for Delivery' : nextStatus === 'Delivered' ? 'Completed' : o.deliveryStatus
                          })}
                        >
                          Mark {nextStatus}
                        </button>
                      )}
                      {o.status !== 'Delivered' && o.status !== 'Cancelled' && (
                        <button 
                          className="btn btn-outline"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                          onClick={() => onUpdateOrder(o.id, { status: 'Cancelled', deliveryStatus: 'Cancelled', paymentStatus: 'Refunded' })}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', color: 'var(--color-text-sub)', padding: '24px' }}>
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


/* ========================================================
   3. INVENTORY MANAGEMENT
   ======================================================== */
export function Inventory({ inventory = [], onUpdateStock }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [stockAdd, setStockAdd] = useState(25);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    const current = inventory.find(i => i.id === selectedItem);
    if (current) {
      onUpdateStock(selectedItem, { stock: current.stock + Number(stockAdd) });
      setStockAdd(25);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
      <div className="dashboard-card">
        <h2 style={{ marginBottom: '16px' }}>Floral Stem Inventory</h2>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Flower Name</th>
                <th>Stock Level</th>
                <th>Min Limit</th>
                <th>Stem Price</th>
                <th>Supplier Information</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => {
                const isLow = item.stock <= item.minStock;
                return (
                  <tr key={item.id} style={{ backgroundColor: isLow ? '#FFFDEB' : 'transparent' }}>
                    <td style={{ fontWeight: 600 }}>{item.id}</td>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td style={{ fontWeight: 600, color: isLow ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                      {item.stock} stems
                    </td>
                    <td style={{ color: 'var(--color-text-sub)' }}>{item.minStock}</td>
                    <td>${Number(item.price).toFixed(2)}</td>
                    <td style={{ fontSize: '0.85rem' }}>{item.supplier}</td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-danger" style={{ animation: 'pulse 2s infinite' }}>⚠️ Low Stock</span>
                      ) : (
                        <span className="badge badge-success">Good</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-card">
        <h2 style={{ marginBottom: '16px' }}>Replenish Inventory</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label htmlFor="flower-replenish-select">Select Flower</label>
            <select 
              id="flower-replenish-select"
              className="form-control"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              required
            >
              <option value="">-- Choose Flower --</option>
              {inventory.map(i => (
                <option key={i.id} value={i.id}>{i.name} ({i.stock} Left)</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="flower-replenish-qty">Stems to Add</label>
            <input 
              id="flower-replenish-qty"
              type="number" 
              className="form-control" 
              min="1" 
              value={stockAdd}
              onChange={(e) => setStockAdd(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Update Stock Count
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-rose-light)', borderRadius: '12px' }}>
          <h3 style={{ fontSize: '0.9rem', color: 'var(--color-rose-dark)', marginBottom: '8px' }}>⚡ Auto-Order Alerts</h3>
          <p style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--color-text-main)' }}>
            System will automatically flag items below the minimum safety threshold. Reorders are dispatched to suppliers daily at 18:00.
          </p>
        </div>
      </div>
    </div>
  );
}


/* ========================================================
   4. DELIVERY TRACKING
   ======================================================== */
export function Delivery({ orders = [], onUpdateOrder }) {
  const deliveryOrders = orders.filter(o => o.status !== 'Cancelled');
  const [selectedPersonnel, setSelectedPersonnel] = useState({});

  // Pin offsets to mock maps coordinates
  const getCoordinatesForOrder = (orderId) => {
    // Generate pseudo-random coordinates based on order id
    const seed = orderId.replace(/\D/g, '') || 50;
    const num = Number(seed);
    const x = 15 + (num * 7) % 70; // percentage
    const y = 15 + (num * 11) % 70;
    return { x: `${x}%`, y: `${y}%` };
  };

  const handleAssign = (orderId, name) => {
    onUpdateOrder(orderId, { 
      deliveryPersonnel: name,
      deliveryStatus: 'Assigned',
      status: 'Processing'
    });
  };

  const advanceDelivery = (orderId, currentStatus) => {
    let nextDelivStatus = '';
    let nextStatus = '';

    if (currentStatus === 'Pending' || currentStatus === 'Assigned') {
      nextDelivStatus = 'Out for Delivery';
      nextStatus = 'In Transit';
    } else if (currentStatus === 'Out for Delivery') {
      nextDelivStatus = 'Completed';
      nextStatus = 'Delivered';
    } else {
      return;
    }

    onUpdateOrder(orderId, { 
      deliveryStatus: nextDelivStatus,
      status: nextStatus
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 2D Delivery Map Grid */}
      <div className="dashboard-card">
        <div className="card-header">
          <h2>Real-Time Courier Map Dispatcher</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>
            🏠 Center pin represents <strong>BloomCraft Flowers Shop</strong>
          </span>
        </div>
        
        <div className="delivery-map-container" style={{ margin: '16px 0' }}>
          <div className="map-grid-lines" />
          <div className="map-store">
            <span style={{ fontSize: '1.2rem' }}>🌸</span> Store HQ
          </div>

          {/* Dynamic pins representing active deliveries */}
          {deliveryOrders.filter(o => o.deliveryStatus !== 'Pending' && o.deliveryStatus !== 'Completed').map(o => {
            const coords = getCoordinatesForOrder(o.id);
            const isOut = o.deliveryStatus === 'Out for Delivery';
            
            return (
              <div key={o.id}>
                <div 
                  className="map-delivery-pin" 
                  style={{ 
                    left: coords.x, 
                    top: coords.y,
                    backgroundColor: isOut ? 'var(--color-rose-dark)' : 'var(--color-warning)',
                    boxShadow: `0 0 10px ${isOut ? 'var(--color-rose)' : '#FFA000'}`
                  }} 
                  title={`Order ${o.id}: ${o.deliveryStatus}`}
                />
                <div 
                  className="map-delivery-label"
                  style={{ 
                    left: `calc(${coords.x} + 12px)`, 
                    top: `calc(${coords.y} - 8px)`
                  }}
                >
                  🚴 {o.deliveryPersonnel} ({o.id})
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dispatches Table */}
      <div className="dashboard-card">
        <h2>Delivery Routing Board</h2>
        <div className="table-container" style={{ marginTop: '16px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Recipient</th>
                <th>Target Coordinates</th>
                <th>Driver Assigned</th>
                <th>Delivery Status</th>
                <th>Order Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveryOrders.map(o => {
                const coords = getCoordinatesForOrder(o.id);
                return (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600 }}>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--color-text-sub)' }}>
                      Latitude Offset: {coords.x}, Longitude: {coords.y}
                    </td>
                    <td>
                      {o.deliveryPersonnel === 'Pending' ? (
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <select 
                            id={`personnel-select-${o.id}`}
                            className="form-control"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', width: '150px' }}
                            value={selectedPersonnel[o.id] || ''}
                            onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, [o.id]: e.target.value })}
                          >
                            <option value="">-- Select Courier --</option>
                            <option value="Sarah Jenkins">Sarah Jenkins (E-Bike)</option>
                            <option value="Robert Davis">Robert Davis (Van)</option>
                            <option value="Marcus Green">Marcus Green (E-Bike)</option>
                          </select>
                          <button 
                            className="btn btn-primary"
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            onClick={() => handleAssign(o.id, selectedPersonnel[o.id])}
                            disabled={!selectedPersonnel[o.id]}
                          >
                            Assign
                          </button>
                        </div>
                      ) : (
                        <strong>🛵 {o.deliveryPersonnel}</strong>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${
                        o.deliveryStatus === 'Completed' ? 'badge-success' :
                        o.deliveryStatus === 'Out for Delivery' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {o.deliveryStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${o.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {o.deliveryStatus !== 'Completed' && o.deliveryPersonnel !== 'Pending' && (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => advanceDelivery(o.id, o.deliveryStatus)}
                        >
                          {o.deliveryStatus === 'Assigned' ? 'Dispatch Driver' : 'Mark Completed'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


/* ========================================================
   5. SALES ANALYTICS
   ======================================================== */
export function Analytics({ orders = [], analytics = {} }) {
  const totalRev = orders.filter(o => o.paymentStatus === 'Paid').reduce((sum, o) => sum + o.total, 0);
  const bestSellers = analytics.bestSellers || [];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      <div className="dashboard-card">
        <h2>Floral Revenue Growth Trends</h2>
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          {/* Custom SVG Bar Chart showing daily sales */}
          <svg viewBox="0 0 500 240" width="100%" height="220">
            {/* Grid lines */}
            {[40, 80, 120, 160, 200].map((y, i) => (
              <line key={i} x1="30" y1={y} x2="480" y2={y} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4,4" />
            ))}
            
            {/* Draw Bars */}
            {(analytics.salesTrend || []).map((t, idx) => {
              const maxVal = Math.max(...(analytics.salesTrend || []).map(x => x.revenue), 100);
              const barHeight = (t.revenue / maxVal) * 160;
              const xPos = 40 + idx * 60;
              const yPos = 200 - barHeight;
              
              return (
                <g key={idx}>
                  <rect 
                    x={xPos} 
                    y={yPos} 
                    width="30" 
                    height={barHeight} 
                    fill="var(--color-rose)" 
                    rx="4"
                    style={{ transition: 'all 0.5s ease' }}
                  />
                  <text x={xPos + 15} y={yPos - 6} textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--color-text-main)">
                    ${Math.round(t.revenue)}
                  </text>
                  <text x={xPos + 15} y="215" textAnchor="middle" fontSize="9" fill="var(--color-text-sub)">
                    {t.date.substring(8)} Jun
                  </text>
                </g>
              );
            })}
            
            <line x1="30" y1="200" x2="480" y2="200" stroke="var(--color-text-main)" strokeWidth="1.5" />
          </svg>
        </div>

        <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>Gross Earnings</span>
            <h3 style={{ color: 'var(--color-rose-dark)', fontSize: '1.4rem', marginTop: '4px' }}>${totalRev.toFixed(2)}</h3>
          </div>
          <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>Avg. Order Basket</span>
            <h3 style={{ color: 'var(--color-lavender-dark)', fontSize: '1.4rem', marginTop: '4px' }}>
              ${orders.length > 0 ? (totalRev / orders.length).toFixed(2) : '0.00'}
            </h3>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Top Best-Selling Floral Stems</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
          {bestSellers.map((flower, idx) => {
            const maxVal = bestSellers[0]?.value || 10;
            const barWidth = (flower.value / maxVal) * 100;
            
            return (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>{idx + 1}. {flower.name}</span>
                  <span style={{ color: 'var(--color-rose-dark)', fontWeight: 'bold' }}>{flower.value} Stems sold</span>
                </div>
                <div style={{ height: '12px', backgroundColor: '#F1E5D9', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: `${barWidth}%`, 
                    background: 'linear-gradient(90deg, var(--color-rose) 0%, var(--color-lavender) 100%)',
                    borderRadius: '6px'
                  }} />
                </div>
              </div>
            );
          })}
          {bestSellers.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-sub)' }}>No sales recorded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}


/* ========================================================
   6. REVENUE REPORTS
   ======================================================== */
export function Revenue({ orders = [] }) {
  const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
  const gross = paidOrders.reduce((sum, o) => sum + o.total, 0);
  
  // Dynamic business math simulation
  const costOfGoods = gross * 0.40; // 40% cost of flower supplies
  const gatewaysFee = paidOrders.reduce((sum, o) => {
    // 2.9% stripe, 2% razorpay
    const rate = o.paymentMethod === 'Stripe' ? 0.029 : 0.02;
    return sum + (o.total * rate);
  }, 0);
  const operationCosts = gross * 0.15; // 15% packaging & logistics
  const netProfit = gross - costOfGoods - gatewaysFee - operationCosts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon revenue" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            <DollarSign size={24} />
          </div>
          <div className="metric-details">
            <p>Gross Receipts</p>
            <h3>${gross.toFixed(2)}</h3>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#FFE082', color: '#F57C00' }}>
            <Percent size={24} />
          </div>
          <div className="metric-details">
            <p>Processing Fees</p>
            <h3>${gatewaysFee.toFixed(2)}</h3>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#FFCDD2', color: '#C62828' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="metric-details">
            <p>Materials & Supplies (Est.)</p>
            <h3>${costOfGoods.toFixed(2)}</h3>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon orders" style={{ background: '#E1BEE7', color: '#6A1B9A' }}>
            <TrendingUp size={24} />
          </div>
          <div className="metric-details">
            <p>Net Profit (Est. 30%)</p>
            <h3>${netProfit.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Profit Margin Matrix</h2>
        <div style={{ display: 'flex', alignItems: 'center', height: '24px', borderRadius: '12px', overflow: 'hidden', margin: '20px 0' }}>
          <div style={{ width: '40%', height: '100%', backgroundColor: '#FFCDD2' }} title="Material Cost (40%)" />
          <div style={{ width: '15%', height: '100%', backgroundColor: '#FFE082' }} title="Logistics (15%)" />
          <div style={{ width: '3%', height: '100%', backgroundColor: '#CFD8DC' }} title="Gateway Processing (3%)" />
          <div style={{ width: '42%', height: '100%', backgroundColor: '#C8E6C9' }} title="Net Yield (42%)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '0.85rem' }}>
          <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#FFCDD2', marginRight: '6px' }}></span>Floral Stock cost (40%)</div>
          <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#FFE082', marginRight: '6px' }}></span>Logistics & Wrap (15%)</div>
          <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#CFD8DC', marginRight: '6px' }}></span>Gateways cut (3%)</div>
          <div><span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#C8E6C9', marginRight: '6px' }}></span>Net Business Margin (42%)</div>
        </div>
      </div>
    </div>
  );
}


/* ========================================================
   7. REVIEWS & FEEDBACK
   ======================================================== */
export function Reviews({ reviews = [], onAddReview }) {
  const [custName, setCustName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!custName || !comment) return;
    onAddReview({ customerName: custName, rating, comment });
    setCustName('');
    setRating(5);
    setComment('');
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) 
    : '5.0';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
      <div>
        <div className="dashboard-card" style={{ marginBottom: '24px' }}>
          <div className="card-header">
            <h2>Average Brand Score: {averageRating} / 5.0</h2>
            <div style={{ color: '#FFB300', fontSize: '1.25rem' }}>
              {'★'.repeat(Math.round(averageRating))}
              {'☆'.repeat(5 - Math.round(averageRating))}
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map(r => (
            <div key={r.id} className="review-card">
              <div className="review-card-header">
                <span className="review-name">👤 {r.customerName}</span>
                <span className="review-date">{r.date}</span>
              </div>
              <div className="review-stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
              <p className="review-comment">"{r.comment}"</p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-card" style={{ height: 'fit-content' }}>
        <h2>Submit Feedback Card</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <div className="form-group">
            <label htmlFor="review-form-name">Customer Name</label>
            <input 
              id="review-form-name"
              type="text" 
              className="form-control" 
              placeholder="e.g. Liam Sterling"
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="review-form-rating">Rating Score</label>
            <select 
              id="review-form-rating"
              className="form-control"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
              <option value="4">⭐⭐⭐⭐ Good (4/5)</option>
              <option value="3">⭐⭐⭐ Neutral (3/5)</option>
              <option value="2">⭐⭐ Fair (2/5)</option>
              <option value="1">⭐ Poor (1/5)</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="review-form-comment">Review Commentary</label>
            <textarea 
              id="review-form-comment"
              className="form-control" 
              rows="4" 
              placeholder="Write customer review..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              style={{ resize: 'none' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Publish Review
          </button>
        </form>
      </div>
    </div>
  );
}


/* ========================================================
   8. PAYMENT TRACKING
   ======================================================== */
export function Payments({ payments = [], onUpdatePayment }) {
  const [gatewayStatus, setGatewayStatus] = useState('Healthy');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon revenue" style={{ background: '#E8F5E9', color: '#2E7D32' }}>
            <CreditCard size={24} />
          </div>
          <div className="metric-details">
            <p>Stripe Gateway status</p>
            <h3 style={{ color: 'var(--color-leaf-dark)' }}>Live / Active</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon orders" style={{ background: '#E3F2FD', color: '#1565C0' }}>
            <CreditCard size={24} />
          </div>
          <div className="metric-details">
            <p>Razorpay Gateway status</p>
            <h3 style={{ color: 'var(--color-info)' }}>Live / Active</h3>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: '#FFF3E0', color: '#EF6C00' }}>
            <RefreshCw size={24} />
          </div>
          <div className="metric-details">
            <p>Automatic Refunds</p>
            <h3>Enabled</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>Gateway Transaction History</h2>
        <div className="table-container" style={{ marginTop: '16px' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Linked Order</th>
                <th>Price Amount</th>
                <th>Gateway Channel</th>
                <th>Timestamp</th>
                <th>Status Badge</th>
                <th style={{ textAlign: 'right' }}>Administration</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.id}</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-rose-dark)' }}>{p.orderId}</td>
                  <td style={{ fontWeight: 600 }}>${Number(p.amount).toFixed(2)}</td>
                  <td>
                    <span className="badge badge-info" style={{ backgroundColor: p.method === 'Stripe' ? '#E1F5FE' : '#EDE7F6', color: p.method === 'Stripe' ? '#0288D1' : '#5E35B1' }}>
                      {p.method}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>
                    {new Date(p.date).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${
                      p.status === 'Succeeded' || p.status === 'Paid' ? 'badge-success' :
                      p.status === 'Pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {p.status === 'Succeeded' && (
                      <button 
                        className="btn btn-outline"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
                        onClick={() => onUpdatePayment(p.id, { status: 'Refunded' })}
                      >
                        Issue Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


/* ========================================================
   9. SYSTEM NOTIFICATIONS
   ======================================================== */
export function Notifications({ notifications = [], onClearAll, onToggleRead }) {
  const unread = notifications.filter(n => !n.read);

  return (
    <div className="dashboard-card">
      <div className="card-header" style={{ marginBottom: '20px' }}>
        <h2>System Activity Logs ({unread.length} Unread)</h2>
        {notifications.length > 0 && (
          <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={onClearAll}>
            <BellOff size={14} /> Clear Logs
          </button>
        )}
      </div>

      <div className="notifications-panel">
        {notifications.map(n => {
          let categoryClass = 'alert-inventory';
          let emoji = '🔔';
          if (n.category === 'order') { categoryClass = 'alert-inventory'; emoji = '🛍️'; }
          else if (n.category === 'inventory') { categoryClass = 'alert-inventory'; emoji = '⚠️'; }
          else if (n.category === 'delivery') { categoryClass = 'alert-delivery'; emoji = '🚴'; }
          else if (n.category === 'payment') { categoryClass = 'alert-payment'; emoji = '💳'; }

          return (
            <div 
              key={n.id} 
              className={`notification-item ${categoryClass} ${!n.read ? 'unread' : ''}`}
              onClick={() => onToggleRead(n.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="notification-item-icon">{emoji}</div>
              <div className="notification-item-content">
                <div className="notification-item-title">{n.title}</div>
                <div className="notification-item-desc">{n.description}</div>
                <div className="notification-item-time">{new Date(n.time).toLocaleTimeString()}</div>
              </div>
              {!n.read && (
                <div style={{ fontSize: '0.7rem', color: 'var(--color-rose-dark)', fontWeight: 'bold' }}>• Unread</div>
              )}
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-sub)', padding: '48px 24px' }}>
            <Bell size={44} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3>All Caught Up!</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>No new notifications or system alerts at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}


/* ========================================================
   10. ADMIN SETTINGS
   ======================================================== */
export function Admin() {
  const [role, setRole] = useState('Admin');
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(true);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
      <div className="dashboard-card">
        <h2>Dashboard Configurations</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Active Operator Persona</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>Change view configuration capabilities</span>
            </div>
            <select 
              id="admin-persona-role"
              className="form-control" 
              style={{ width: '180px' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Admin">Administrator (All views)</option>
              <option value="Designer">Florist Designer</option>
              <option value="Operator">Logistics Manager</option>
            </select>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--color-border)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Automatic Courier Dispatch</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>Automatically match drivers with paid orders</span>
            </div>
            <input 
              type="checkbox" 
              checked={autoDispatch} 
              onChange={() => setAutoDispatch(!autoDispatch)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', fontSize: '0.9rem' }}>Low Stock Push Alerts</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)' }}>Send browser push notification when stock falls</span>
            </div>
            <input 
              type="checkbox" 
              checked={stockAlerts} 
              onChange={() => setStockAlerts(!stockAlerts)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <h2>System Monitoring Health</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <HardDrive size={20} style={{ color: 'var(--color-rose-dark)' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Local JSON Adaptor</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Status: Active (Data synced: backend/data/db.json)</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield size={20} style={{ color: 'var(--color-leaf-dark)' }} />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>MongoDB Fallback Engine</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)' }}>Status: Dormant (Waiting for environment MONGODB_URI)</div>
            </div>
          </div>

          <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', backgroundColor: '#FAF9F6', marginTop: '16px' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>🔑 Developer Notice</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-sub)', lineHeight: '1.4' }}>
              Authentication is simulated through the administrative profile avatar. Stripe and Razorpay checkouts are executed in isolated developer sandboxes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
