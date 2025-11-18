import React, { useEffect, useState } from 'react';
import API from '../api';
import SummaryCard from '../components/SummaryCard';
import SalesChart from '../components/SalesChart';
import DataTable from '../components/DataTable';
import AddModal from '../components/AddModal';
import { useAuth } from "../auth/useAuth";
import './Dashboard.css';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 15000);
    return () => clearInterval(id);
  }, []);

  async function fetchAll() {
    try {
      const [m, c, t] = await Promise.all([
        API.get('/reports/metrics'),
        API.get('/reports/chart?months=6'),
        API.get('/reports/table?limit=10')
      ]);
      setMetrics(m.data);
      setChartData(c.data);
      setTableRows(t.data.rows);
    } catch (e) {
      console.error(e);
    }
  }

  // 🔥 DELETE RECORD
  async function handleDelete(id) {
    if (user?.role !== "analyst") return alert("Only analysts can delete!");

    try {
      await API.delete(`/reports/${id}`);
      fetchAll();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  // 🔥 EDIT RECORD
  async function handleEdit(item) {
    if (user?.role !== "analyst") return alert("Only analysts can edit!");

    const newAmount = prompt("Enter new sales amount", item.amount);
    if (!newAmount) return;

    try {
      await API.patch(`/reports/${item._id}`, { amount: Number(newAmount) });
      fetchAll();
    } catch (err) {
      console.error("Edit failed:", err);
    }
  }

  // 🔥 ADD NEW RECORD
  async function handleAdd(data) {
    try {
      await API.post("/reports", data);
      setShowAdd(false);
      fetchAll();
    } catch (err) {
      console.error("Create failed:", err);
    }
  }

  return (
    <div className="dashboard-container">

      {/* ROLE BADGE */}
      <div className="role-badge">
        Logged in as: <span>{user?.role?.toUpperCase()}</span>
      </div>

      <h1 className="dashboard-title">📊 Dashboard Overview</h1>

      <div className="cards">
        <SummaryCard title="Total Sales" value={metrics?.totalSales ?? 0} icon="💰" />
        <SummaryCard title="Total Orders" value={metrics?.totalOrders ?? 0} icon="📦" />
        <SummaryCard title="Inventory Count" value={metrics?.inventoryCount ?? 0} icon="📊" />
      </div>

      <div className="chart-section">
        <h2>Sales Trend (Last 6 Months)</h2>
        <div className="chart-box">
          <SalesChart data={chartData} />
        </div>
      </div>

      <div className="table-section">

        {/* ONLY ANALYST CAN SEE ADD BUTTON */}
        {user?.role === "analyst" && (
          <button className="add-btn" onClick={() => setShowAdd(true)}>
            ➕ Add New Transaction
          </button>
        )}

        <h2>Recent Transactions</h2>

        <DataTable
          rows={tableRows}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* POPUP MODAL */}
      {showAdd && (
        <AddModal 
          onClose={() => setShowAdd(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
}
