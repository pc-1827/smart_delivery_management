import React, { useEffect, useState } from "react";
import { Assignment, Order } from "../types";

const AssignmentsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<{
    totalAssignments: number;
    successRate: number;
  } | null>(null);
  const [partnersStatus, setPartnersStatus] = useState<{
    available: number;
    busy: number;
    offline: number;
  }>({
    available: 0,
    busy: 0,
    offline: 0,
  });
  const [incompleteOrders, setIncompleteOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchPartnerAvailability();
    fetchIncompleteOrders();
    fetchAssignmentMetrics();
  }, []);

  const fetchAssignmentMetrics = async () => {
    try {
      const response = await fetch("/api/assignments/metrics");
      const data = await response.json();
      setMetrics(data);
    } catch {
      // fallback
    }
  };

  // Replace random partner availability
  const fetchPartnerAvailability = async () => {
    try {
      const response = await fetch("/api/partners");
      const allPartners = await response.json(); // real data
      const available = allPartners.filter(
        (p: any) => p.currentLoad < 3 && p.status === "active"
      ).length;
      const busy = allPartners.filter(
        (p: any) => p.currentLoad >= 3 && p.status === "active"
      ).length;
      const offline = allPartners.filter(
        (p: any) => p.status === "inactive"
      ).length;
      setPartnersStatus({ available, busy, offline });
    } catch {
      // fallback
    }
  };

  // Show only orders not delivered
  const fetchIncompleteOrders = async () => {
    const response = await fetch("/api/orders");
    const data = await response.json();
    const filtered = data.filter((o: Order) => o.status !== "delivered");
    setIncompleteOrders(filtered);
  };

  // No need for random sample assignments; we can remove fetchAssignments entirely, or just skip it.

  return (
    <div className="container">
      <h1>Assignment Dashboard</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <div className="card" style={{ flex: "1 1 250px" }}>
          <h2>Partner Availability</h2>
          <p>Available: {partnersStatus.available}</p>
          <p>Busy: {partnersStatus.busy}</p>
          <p>Offline: {partnersStatus.offline}</p>
        </div>
        <div className="card" style={{ flex: "1 1 250px" }}>
          <h2>Assignment Metrics</h2>
          {metrics && (
            <>
              <p>Total Assignments: {metrics.totalAssignments}</p>
              <p>Success Rate: {metrics.successRate.toFixed(1)}%</p>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <h2>Active Assignments</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {incompleteOrders.map((o, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              Order #{o.orderNumber}, Status: {o.status}, AssignedTo:{" "}
              {o.assignedTo || "Unassigned"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AssignmentsPage;
