import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Order } from '../types';

const PartnerOrdersPage: React.FC = () => {
  const { id } = useParams();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<'none' | 'current' | 'completed'>('none');

  useEffect(() => {
    if (!id) return;
    fetchOrders();
  }, [id]);

  const fetchOrders = async () => {
    const res = await fetch(`/api/orders?assignedTo=${id}`);
    const data: Order[] = await res.json();
    setAllOrders(data);
  };

  const reload = () => {
    fetchOrders();
  };

  const handleMarkPicked = async (orderId: string) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'picked' })
    });
    reload();
  };

  const handleMarkDelivered = async (orderId: string) => {
    await fetch('/api/assignments/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: 'success' })
    });
    reload();
  };
  
  const handleMarkFailed = async (orderId: string) => {
    const reason = prompt('Please provide the reason for failure:');
    if (!reason) return;
  
    // Post to executeAssignment
    await fetch('/api/assignments/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status: 'failed', reason })
    });
    reload();
  };
  const handleReschedule = async (orderId: string) => {
    const newTime = prompt('Enter new scheduled time (HH:mm):', '09:00');
    if (!newTime) return;
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scheduledFor: newTime })
    });
    reload();
  };

  const filteredOrders = allOrders.filter((o) => {
    if (viewMode === 'current') {
      return o.status === 'assigned' || o.status === 'picked';
    }
    if (viewMode === 'completed') {
      return o.status === 'delivered';
    }
    return false;
  });

  return (
    <div className="container">
      <h1>Orders for Partner {id}</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <button onClick={() => setViewMode('current')}>View Current Orders</button>
        <button onClick={() => setViewMode('completed')}>View Completed Orders</button>
      </div>
  
      {viewMode === 'none' && <p>Select an option above.</p>}
  
      {(viewMode === 'current' || viewMode === 'completed') && (
        <div className="card">
          <h2>{viewMode === 'current' ? 'Current Orders' : 'Completed Orders'}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {filteredOrders.map((o) => (
              <li key={o._id} style={{ margin: '1rem 0' }}>
                <p><strong>Order #{o.orderNumber}</strong></p>
                <p>Status: {o.status} | Scheduled: {o.scheduledFor}</p>
                <p>Items: {o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
                <p>Area: {o.area} | Total: ${o.totalAmount}</p>
                {viewMode === 'current' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {o.status === 'assigned' && (
                      <button onClick={() => handleMarkPicked(o._id)}>Mark Picked</button>
                    )}
                    {o.status === 'picked' && (
                      <button onClick={() => handleMarkDelivered(o._id)}>Mark Delivered</button>
                    )}
                    <button onClick={() => handleMarkFailed(o._id)}>Mark Failed</button>
                    <button onClick={() => handleReschedule(o._id)}>Reschedule</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PartnerOrdersPage;