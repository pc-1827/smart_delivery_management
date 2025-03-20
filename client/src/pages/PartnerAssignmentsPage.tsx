import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Assignment } from '../types';

const PartnerAssignmentsPage: React.FC = () => {
  const { id } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    fetchAssignments();
  }, [id]);

  const fetchAssignments = async () => {
    if (!id) return;
    try {
      const response = await fetch(`/api/assignments?partnerId=${id}`);
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Assignments for Partner {id}</h1>
      <ul>
        {assignments.map((a, i) => (
          <li key={i}>
            Order: {a.orderId}, Status: {a.status}, Timestamp: {a.timestamp}, Reason: {a.reason || 'N/A'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnerAssignmentsPage;