import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_AREAS = [
  'Area1', 'Area2', 'Area3', 'Area4',
  'Area5', 'Area6', 'Area7', 'Area8',
  'Area9', 'Area10'
];

const OrderForm: React.FC = () => {
  const navigate = useNavigate();

  // Form state
  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderArea, setOrderArea] = useState('');
  const [items, setItems] = useState([
    { name: '', quantity: 1, price: 1 }
  ]);

  // Add more items
  const handleAddItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 1 }]);
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle item changes
  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] =
      field === 'quantity' || field === 'price' ? Number(value) : value;
    setItems(updated);
  };

  // Submit form
  const createNewOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const orderPayload = {
      customer: {
        name: customerName,
        phone: customerPhone,
        address: customerAddress
      },
      area: orderArea,
      items,
      totalAmount
    };

    // Create order
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    // Auto-assign
    await fetch('/api/assignments/auto-assign', {
      method: 'POST'
    });

    // Return to orders
    navigate('/orders');
  };

  return (
    <div>
      <h1>Create New Order</h1>
      <form
        onSubmit={createNewOrder}
        style={{ display: 'flex', flexDirection: 'column', maxWidth: 400, gap: 8 }}
      >
        <label>Customer Name</label>
        <input
          type="text"
          placeholder="Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <label>Customer Phone</label>
        <input
          type="text"
          placeholder="Phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />

        <label>Customer Address</label>
        <input
          type="text"
          placeholder="Address"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          required
        />

        <label>Area</label>
        <select
          value={orderArea}
          onChange={(e) => setOrderArea(e.target.value)}
          required
        >
          <option value="">-- Select Area --</option>
          {ALL_AREAS.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        {/* Items Section */}
        <h3>Items</h3>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label>Item Name</label>
              <input
                type="text"
                placeholder="Item Name"
                value={it.name}
                onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label>Quantity</label>
              <input
                type="number"
                min={1}
                value={it.quantity}
                onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label>Price</label>
              <input
                type="number"
                min={1}
                value={it.price}
                onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
              />
            </div>

            {items.length > 1 && (
              <button type="button" onClick={() => handleRemoveItem(idx)}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddItem}>Add Another Item</button>

        <button type="submit">Submit Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
