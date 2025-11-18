import React, { useState } from "react";
import { useAuth } from "../auth/useAuth";
import "./DataTable.css";

export default function DataTable({ rows, onEdit, onDelete }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Extract unique categories safely
  const categories = [
    "all",
    ...new Set(rows.map(r => r.category).filter(Boolean))
  ];

  // Filter safely
  const filtered = rows.filter(r => {
    const cat = r.category ? r.category.toLowerCase() : "";

    const matchesCategory =
      category === "all" || cat === category.toLowerCase();

    const matchesSearch =
      cat.includes(search.toLowerCase()) ||
      String(r.amount).includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="data-table-container">

      {/* Search + filter */}
      <div className="table-controls">
        <input
          type="text"
          placeholder="Search category or amount..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Sales</th>
              <th>Date</th>
              {user?.role === "analyst" && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>

            {filtered.length === 0 && (
              <tr>
                <td colSpan={user?.role === "analyst" ? 4 : 3} className="no-results">
                  No matching data
                </td>
              </tr>
            )}

            {filtered.map((row, index) => (
              <tr key={row._id || index}>
                <td>{row.category || "—"}</td>
                <td>{row.amount}</td>
                <td>{new Date(row.date).toLocaleDateString()}</td>

                {user?.role === "analyst" && (
                  <td className="actions-cell">
                    <button
                      className="edit-btn"
                      onClick={() => onEdit && onEdit(row)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => onDelete && onDelete(row._id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </div>
  );
}
