import React from 'react';
import { ShoppingBag, Users, DollarSign, Truck, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function Dashboard({ 
  orders = [], 
  customers = [], 
  inventory = [], 
  payments = [], 
  analytics = {}, 
  setActiveTab 
}) {
  
  // Calculate quick metrics locally for safety if analytics fails
  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const monthlyRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);
  const pendingDeliveries = orders.filter(o => o.deliveryStatus === 'Pending' || o.deliveryStatus === 'Out for Delivery').length;

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock);

  // Render a custom SVG Area/Line Chart for Sales Trends (rose/lavender themed)
  const renderSalesTrendChart = () => {
    const trend = analytics.salesTrend || [];
    if (trend.length === 0) {
      return (
        <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-sub)' }}>
          Loading Sales Data...
        </div>
      );
    }

    const maxVal = Math.max(...trend.map(t => t.revenue), 100);
    const chartHeight = 160;
    const chartWidth = 500;
    const padding = 20;
    
    // Plot points
    const points = trend.map((t, idx) => {
      const x = padding + (idx * (chartWidth - padding * 2) / (trend.length - 1));
      const y = chartHeight - padding - (t.revenue / maxVal * (chartHeight - padding * 2));
      return { x, y, ...t };
    });

    const pathData = points.length > 0 
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
      : '';
      
    const areaData = points.length > 0
      ? `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
      : '';

    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="200px" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-rose)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-rose)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="var(--color-border)" strokeWidth="1" />
        <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
        <line x1={padding} y1={chartHeight/2} x2={chartWidth - padding} y2={chartHeight/2} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />

        {/* Shaded Area */}
        {areaData && <path d={areaData} fill="url(#chartGrad)" />}
        
        {/* Trend Line */}
        {pathData && <path d={pathData} fill="none" stroke="var(--color-rose-dark)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
        
        {/* Dots & Labels */}
        {points.map((p, idx) => (
          <g key={idx} className="chart-dot-group">
            <circle cx={p.x} cy={p.y} r="5" fill="var(--color-white)" stroke="var(--color-rose-dark)" strokeWidth="2.5" />
            {/* Label for last item or peak */}
            {(idx === points.length - 1 || idx === 0) && (
              <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--color-text-main)">
                ${p.revenue}
              </text>
            )}
            <text x={p.x} y={chartHeight - 4} textAnchor="middle" fontSize="9" fill="var(--color-text-sub)">
              {p.date.substring(5)}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  // Render a custom donut/bar layout for Inventory Stocks
  const renderInventoryChart = () => {
    const status = analytics.stockStatus || [];
    if (status.length === 0) return <div>Loading Inventory Data...</div>;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {status.slice(0, 5).map((item, idx) => {
          const percentage = Math.min(100, (item.stock / 150) * 100);
          const isLow = item.stock <= item.minStock;
          return (
            <div key={idx} style={{ fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <span style={{ color: isLow ? 'var(--color-danger)' : 'var(--color-text-sub)', fontWeight: 600 }}>
                  {item.stock} Stems {isLow && '(Low)'}
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#F1E5D9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${percentage}%`, 
                  backgroundColor: isLow ? 'var(--color-danger)' : 'var(--color-leaf)',
                  borderRadius: '4px'
                }} />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon orders">
            <ShoppingBag size={24} />
          </div>
          <div className="metric-details">
            <p>Total Orders</p>
            <h3>{totalOrders}</h3>
            <span className="metric-trend up">
              <ArrowUpRight size={14} /> +12.5% this week
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon customers">
            <Users size={24} />
          </div>
          <div className="metric-details">
            <p>Active Customers</p>
            <h3>{totalCustomers}</h3>
            <span className="metric-trend up">
              <ArrowUpRight size={14} /> +8.2% this month
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon revenue">
            <DollarSign size={24} />
          </div>
          <div className="metric-details">
            <p>Monthly Revenue</p>
            <h3>${monthlyRevenue.toFixed(2)}</h3>
            <span className="metric-trend up">
              <ArrowUpRight size={14} /> +15.3% growth
            </span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon deliveries">
            <Truck size={24} />
          </div>
          <div className="metric-details">
            <p>Pending Deliveries</p>
            <h3>{pendingDeliveries}</h3>
            <span className="metric-trend down">
              <ArrowDownRight size={14} /> -4.1% queue time
            </span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Sales Trend Chart Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Weekly Sales Trend ($)</h2>
            <button className="card-action-btn" onClick={() => setActiveTab('analytics')}>Detailed Analytics</button>
          </div>
          <div style={{ marginTop: '16px' }}>
            {renderSalesTrendChart()}
          </div>
        </div>

        {/* Stock Status Card */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Flower Stock Status</h2>
            <button className="card-action-btn" onClick={() => setActiveTab('inventory')}>Manage Stock</button>
          </div>
          {renderInventoryChart()}
          {lowStockItems.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              backgroundColor: '#FFF8E1', 
              border: '1px solid #FFE082', 
              borderRadius: '8px',
              display: 'flex',
              gap: '8px',
              color: '#B78103',
              fontSize: '0.8rem',
              alignItems: 'center'
            }}>
              <AlertTriangle size={16} />
              <span><strong>{lowStockItems.length} items</strong> are below minimum safety stock!</span>
            </div>
          )}
        </div>

        {/* Recent Orders Table */}
        <div className="dashboard-card full-width">
          <div className="card-header">
            <h2>Recent Customer Orders</h2>
            <button className="card-action-btn" onClick={() => setActiveTab('orders')}>All Orders</button>
          </div>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Total Price</th>
                  <th>Order Status</th>
                  <th>Payment Status</th>
                  <th>Delivery Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-rose-dark)' }}>{o.id}</td>
                    <td>{o.customerName}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ fontWeight: 600 }}>${Number(o.total).toFixed(2)}</td>
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
                    </td>
                    <td>{o.deliveryStatus}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--color-text-sub)' }}>No orders found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
