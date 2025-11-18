// utils/sampleData.js

const categories = ["sales", "refund", "inventory", "purchase", "expense"];

const monthsBack = [5, 4, 3, 2, 1, 0];

const sampleReports = monthsBack.map((m, i) => ({
  amount: Math.floor(Math.random() * 2000) + 1000,
  date: new Date(2025, new Date().getMonth() - m, 10),

  category: categories[Math.floor(Math.random() * categories.length)],

  title: `Report ${i + 1}`,
  description: "Auto-generated sample data",
}));

module.exports = sampleReports;
