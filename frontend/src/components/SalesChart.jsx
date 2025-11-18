import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Filler, Legend);

export default function SalesChart({ data }) {
  if (!data) return <p>No chart data available.</p>;

  console.log("Chart Raw Data:", data);

  // ---------------------------------------------------------
  // ✅ Build last 6 months array (labels always stable)
  // ---------------------------------------------------------
  const now = new Date();
  const monthsList = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    
    monthsList.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: d.toLocaleString("default", { month: "short" })
    });
  }

  // ---------------------------------------------------------
  // ✅ Merge backend data with fallback values for missing months
  // ---------------------------------------------------------
  const values = monthsList.map((m) => {
    const found = data.find(
      d => d._id.year === m.year && d._id.month === m.month
    );
    return found ? found.total : 0;
  });

  const labels = monthsList.map(m => m.label);

  // ---------------------------------------------------------
  // Chart Data
  // ---------------------------------------------------------
  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales",
        data: values,
        borderColor: "#4f8cf3",
        backgroundColor: "rgba(79, 140, 243, 0.25)",
        borderWidth: 3,
        pointBackgroundColor: "#4f8cf3",
        fill: true,
        tension: 0.4
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#2c3e50",
          font: { size: 12 }
        }
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        ticks: { color: "#2c3e50" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#2c3e50" },
        grid: { color: "#d9e4ff" },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
}
