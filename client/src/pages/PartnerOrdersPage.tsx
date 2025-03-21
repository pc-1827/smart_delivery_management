import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Order } from '../types';

const PartnerOrdersPage: React.FC = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders?assignedTo=${id}`)
      .then(res => res.json())
      .then((data: Order[]) => setOrders(data))
      .catch(() => null);
  }, [id]);

  const updateOrder = async (orderId: string, partial: Partial<Order>) => {
    await fetch(`/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partial)
    });
    // Reload
    const res = await fetch(`/api/orders?assignedTo=${id}`);
    setOrders(await res.json());
  };

  return (
    <div>
      <h1>Orders for Partner {id}</h1>
      <ul>
        {orders.map((o) => (
          <li key={o._id} style={{ margin: '0.5rem 0' }}>
            <p>Order #{o.orderNumber} – Status: {o.status} – Scheduled: {o.scheduledFor}</p>
            <p>Items: {o.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
            <p>Area: {o.area}, Total: ${o.totalAmount}</p>
            <button onClick={() => updateOrder(o._id, { status: 'picked' })}>Mark Picked</button>
            <button onClick={() => updateOrder(o._id, { status: 'delivered' })}>Mark Delivered</button>
            <button onClick={() => updateOrder(o._id, { scheduledFor: '15:00' })}>Reschedule 15:00</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnerOrdersPage;