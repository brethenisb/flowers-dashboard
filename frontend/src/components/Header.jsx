import React from 'react';
import { Bell } from 'lucide-react';

const TAB_METADATA = {
  'dashboard': { title: 'Dashboard Overview', desc: 'Real-time performance metrics and business activities' },
  'customers': { title: 'Customer Management', desc: 'Maintain user profiles, loyalty rewards, and customer history' },
  'orders': { title: 'Order Management', desc: 'Create, update, track, and manage customer bouquet requests' },
  'bouquet-builder': { title: 'Bouquet Builder Tool', desc: 'Design customized flower arrangements with live visual preview' },
  'inventory': { title: 'Inventory Management', desc: 'Monitor flower stem stock levels, suppliers, and reorder alerts' },
  'delivery': { title: 'Delivery Tracking', desc: 'Dispatch delivery personnel and trace orders on a real-time grid' },
  'analytics': { title: 'Sales Analytics', desc: 'Gain detailed insights on sales patterns and popular florals' },
  'revenue': { title: 'Revenue Reports', desc: 'Analyze revenues, profit streams, and transaction statistics' },
  'reviews': { title: 'Reviews & Feedback', desc: 'Review ratings, customer opinions, and sentiment tracking' },
  'payments': { title: 'Payment Tracking', desc: 'Verify transaction logs, check refund status, and payment gateway health' },
  'notifications': { title: 'Notification System', desc: 'System alerts, low stock messages, and client activity logs' },
  'admin': { title: 'Admin Settings', desc: 'Configure system settings, roles, and administrative access' }
};

export default function Header({ activeTab, setActiveTab, unreadCount }) {
  const meta = TAB_METADATA[activeTab] || { title: 'BloomCraft', desc: 'Admin Panel' };

  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>{meta.title}</h1>
        <p>{meta.desc}</p>
      </div>
      
      <div className="header-actions">
        <div 
          className="notification-bell" 
          onClick={() => setActiveTab('notifications')}
          title="Open Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <div className="user-name">Alice Dupont</div>
            <div className="user-role">Floral Designer (Admin)</div>
          </div>
        </div>
      </div>
    </header>
  );
}
