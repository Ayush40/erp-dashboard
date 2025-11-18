import React, { useState } from "react";
import "./AddModal.css";

export default function AddModal({ onClose, onSubmit }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const submit = () => {
    if (!category || !amount || !date) {
      alert("All fields are required");
      return;
    }
    onSubmit({ category, amount: Number(amount), date });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add New Transaction</h2>

        <div className="modal-field">
          <label>Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div className="modal-field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={submit}>Save</button>
        </div>
      </div>
    </div>
  );
}
