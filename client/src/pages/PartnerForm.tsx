import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeliveryPartner } from '../types';

const ALL_AREAS = ['Area1', 'Area2', 'Area3', 'Area4', 'Area5', 'Area6', 'Area7', 'Area8', 'Area9', 'Area10'];

const PartnerForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [partnerData, setPartnerData] = useState<DeliveryPartner>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    currentLoad: 0,
    areas: [],
    shift: {
      start: '09:00',
      end: '17:00'
    },
    metrics: {
      rating: 0,
      completedOrders: 0,
      cancelledOrders: 0
    }
  });

  useEffect(() => {
    if (isEditing) {
      // Fetch current partner details
      fetch(`/api/partners/${id}`)
        .then((res) => res.json())
        .then((data: DeliveryPartner) => {
          setPartnerData(data);
        })
        .catch(() => null);
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPartnerData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShiftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPartnerData((prev) => ({
      ...prev,
      shift: { ...prev.shift, [name]: value }
    }));
  };

  const handleAreasChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Multiple select
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setPartnerData((prev) => ({ ...prev, areas: selectedOptions }));
  };

  const handleAreaCheckbox = (area: string) => {
    setPartnerData((prev) => {
      const alreadySelected = prev.areas.includes(area);
      if (alreadySelected) {
        return { ...prev, areas: prev.areas.filter((a) => a !== area) };
      } else {
        return { ...prev, areas: [...prev.areas, area] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/partners/${id}` : '/api/partners';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partnerData)
    });

    navigate('/partners');
  };

  return (
    <div className="container">
      <h1>{isEditing ? 'Update Partner' : 'Create New Partner'}</h1>
      <div className="card" style={{ marginTop: '1rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            name="name"
            placeholder="Name"
            value={partnerData.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            type="email"
            value={partnerData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={partnerData.phone}
            onChange={handleChange}
            required
          />
          <label>Status:</label>
          <select name="status" value={partnerData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
  
          <label>Areas:</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ALL_AREAS.map((area) => (
              <label key={area} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={partnerData.areas.includes(area)}
                  onChange={() => handleAreaCheckbox(area)}
                />
                <span style={{ marginLeft: '0.25rem' }}>{area}</span>
              </label>
            ))}
          </div>
  
          <label>Shift Start:</label>
          <input
            type="time"
            name="start"
            value={partnerData.shift.start}
            onChange={handleShiftChange}
          />
          <label>Shift End:</label>
          <input
            type="time"
            name="end"
            value={partnerData.shift.end}
            onChange={handleShiftChange}
          />
  
          <button type="submit">{isEditing ? 'Save Changes' : 'Create Partner'}</button>
        </form>
      </div>
    </div>
  );
};

export default PartnerForm;