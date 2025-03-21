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
    <>
      <h1>Orders</h1>
      
      {/* Button to create new order */}
      <button onClick={handleCreateClick}>Create New Order</button>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0' }}>
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        >
          <option value="">All Areas</option>
          <option value="Area1">Area1</option>
          <option value="Area2">Area2</option>
          <option value="Area3">Area3</option>
          <option value="Area4">Area4</option>
          <option value="Area5">Area5</option>
          <option value="Area6">Area6</option>
          <option value="Area7">Area7</option>
          <option value="Area8">Area8</option>
          <option value="Area9">Area9</option>
          <option value="Area10">Area10</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked">Picked</option>
          <option value="delivered">Delivered</option>
        </select>
        <input
        type="date"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
      </div>

      {/* List of orders */}
      <ul>
        {filteredOrders.map((order) => (
          <li key={order._id}>
            <strong>{order.orderNumber}</strong> – Area: {order.area}, 
            Status: {order.status},
            Scheduled: {order.scheduledFor},
            Total: ${order.totalAmount} 
            (Created: {new Date(order.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrdersPage;