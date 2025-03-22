import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [areaFilter, setAreaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  React.useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders');
    const data = await response.json();
    // Sort from newest to oldest
    data.sort(
      (a: Order, b: Order) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setOrders(data);
  };

  // Navigate to new order form
  const handleCreateClick = () => {
    navigate('/orders/new');
  };

  const filteredOrders = orders.filter((o) => {
    if (areaFilter && o.area !== areaFilter) return false;
    if (statusFilter && o.status !== statusFilter) return false;
    if (dateFilter && new Date(o.createdAt).toLocaleDateString() !== new Date(dateFilter).toLocaleDateString()) {
      return false;
    }
    return true;
  });

  return (
    <div className="container">
      <h1>Orders</h1>
      <button onClick={handleCreateClick} style={{ margin: '1rem 0' }}>Create New Order</button>
  
      <div className="card">
        <h2>Filters</h2>
        <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
          {/* Area Filter */}
          <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
            <option value="">All Areas</option>
            {/* ...options... */}
          </select>
          {/* Status Filter */}
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {/* ...options... */}
          </select>
          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
      </div>
  
      <div className="card" style={{ marginTop: '1rem' }}>
        <h2>Order List</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredOrders.map((order) => (
            <li key={order._id} style={{ margin: '1rem 0' }}>
              <strong>{order.orderNumber}</strong> – Area: {order.area}, 
              Status: {order.status}, Scheduled: {order.scheduledFor}, 
              Total: ${order.totalAmount} (Created: {new Date(order.createdAt).toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrdersPage;