import React, { useEffect, useState } from 'react';
import { DeliveryPartner } from '../types';

const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, [refresh]);

  const fetchPartners = async () => {
    const response = await fetch('/api/partners');
    const data = await response.json();
    setPartners(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, status: 'active' }),
    });
    setName('');
    setEmail('');
    setRefresh(!refresh);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    await fetch(`/api/partners/${id}`, { method: 'DELETE' });
    setRefresh(!refresh);
  };

  return (
    <>
      <h1>Partners</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Partner Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          placeholder="Partner Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add Partner</button>
      </form>

      <ul>
        {partners.map((partner) => (
          <li key={partner._id}>
            <strong>{partner.name}</strong> – {partner.email} ({partner.status})
            <button onClick={() => handleDelete(partner._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PartnersPage;