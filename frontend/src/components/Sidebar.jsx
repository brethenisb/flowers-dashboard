import React from 'react';
import { 
  LayoutDashboard, Users, ShoppingBag, Flower2, Package, 
  Truck, TrendingUp, DollarSign, MessageSquare, CreditCard, 
  Bell, Settings 
} from 'lucide-react';

const MENU_ITEMS = [
  { id: 'dashboard', name: 'Dashboard Overview', icon: LayoutDashboard },
  { id: 'customers', name: 'Customer Management', icon: Users },
  { id: 'orders', name: 'Order Management', icon: ShoppingBag },
  { id: 'bouquet-builder', name: 'Bouquet Builder', icon: Flower2 },
  { id: 'inventory', name: 'Inventory Management', icon: Package },
  { id: 'delivery', name: 'Delivery Tracking', icon: Truck },
  { id: 'analytics', name: 'Sales Analytics', icon: TrendingUp },
  { id: 'revenue', name: 'Revenue Reports', icon: DollarSign },
  { id: 'reviews', name: 'Reviews & Feedback', icon: MessageSquare },
  { id: 'payments', name: 'Payment Tracking', icon: CreditCard },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'admin', name: 'Admin Settings', icon: Settings }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Flower2 size={28} className="logo-icon" />
        <span>BloomCraft</span>
      </div>
      
      <ul className="sidebar-menu">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <a 
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                href={`#${item.id}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
      
      <div className="sidebar-footer">
        <p>© 2026 BloomCraft Flowers</p>
        <p style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.8 }}>V1.0.0 Admin Portal</p>
      </div>
    </aside>
  );
}
