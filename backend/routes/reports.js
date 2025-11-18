const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Report = require('../models/Report');

// 📌 SUMMARY METRICS
router.get('/metrics', auth, async (req, res) => {
  const totalSales = await Report.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
  ]);

  const totals = totalSales[0] || { total: 0, count: 0 };

  res.json({
    totalSales: totals.total,
    totalOrders: totals.count,
    inventoryCount: totals.count
  });
});

// 📌 SALES CHART DATA
router.get('/chart', auth, async (req, res) => {
  const months = parseInt(req.query.months) || 6;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

  const data = await Report.aggregate([
    { $match: { date: { $gte: start } } },
    { $project: { year: { $year: "$date" }, month: { $month: "$date" }, amount: 1 } },
    { $group: { _id: { year: "$year", month: "$month" }, total: { $sum: "$amount" } } },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  res.json(data);
});

// 📌 TABLE DATA
router.get('/table', auth, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const total = await Report.countDocuments(filter);
  const rows = await Report.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  res.json({ total, page, limit, rows });
});

// --------------------------------------------------
// 🔥 CREATE (ANALYST ONLY)
// --------------------------------------------------
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== "analyst") {
      return res.status(403).json({ message: "Only ANALYST can create data" });
    }

    const { date, amount, category } = req.body;

    if (!date || !amount || !category) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const report = await Report.create({
      date,
      amount,
      category
    });

    res.json({ message: "Created", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------
// 🔥 UPDATE (ANALYST ONLY)
// --------------------------------------------------
router.patch('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== "analyst") {
      return res.status(403).json({ message: "Only ANALYST can update data" });
    }

    const updated = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!updated) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Updated", report: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --------------------------------------------------
// 🔥 DELETE (ANALYST ONLY)
// --------------------------------------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== "analyst") {
      return res.status(403).json({ message: "Only ANALYST can delete data" });
    }

    const deleted = await Report.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Report not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
