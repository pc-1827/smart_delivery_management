import React, { useEffect, useState } from 'react';
import { Order } from '../types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [areaFilter, setAreaFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch('/api/orders'); 
    const data = await response.json();
    setOrders(data);
  };

  const filteredOrders = orders.filter((o) => {
    if (areaFilter && o.area !== areaFilter) return false;
    if (statusFilter && o.status !== statusFilter) return false;
    return true;
  });

  return (
    <>
      <h1>Orders</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
          <option value="">All Areas</option>
          <option value="CityCenter">CityCenter</option>
          <option value="Suburb">Suburb</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="assigned">Assigned</option>
          <option value="picked">Picked</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>
      <ul>
        {filteredOrders.map((order) => (
          <li key={order._id}>
            <strong>{order.orderNumber}</strong> – Area: {order.area}, 
            Status: {order.status}, 
            Total: ${order.totalAmount}
          </li>
        ))}
      </ul>
    </>
  );
};

export default OrdersPage;