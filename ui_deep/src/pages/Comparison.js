import React, { useEffect, useState } from "react";
import "./Comparison.css";
import Navbar from "../Components/Navbar.js";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Comparison() {
  const [data, setData] = useState([]);

  // Fetch data
  useEffect(() => {
    fetch("http://127.0.0.1:8000/comparison")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Best model
  const bestModel =
    data.length > 0
      ? data.reduce((a, b) => (a.accuracy > b.accuracy ? a : b))
      : null;

  // Chart Data
  const chartData = {
    labels: data.map(d => d.model),
    datasets: [
      {
        label: "Accuracy",
        data: data.map(d => d.accuracy),
        backgroundColor: "#00d4ff",
      },
      {
        label: "F1 Score",
        data: data.map(d => d.f1_score),
        backgroundColor: "#ff7b00", 
      }
    ]
  };

  const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "black"
      }
    }
  },
  scales: {
    x: {
      ticks: { color: "black" },
      grid: { color: "#ccc" }
    },
    y: {
      ticks: { 
        color: "black",   
        stepSize: 0.1     
      },
      grid: { color: "#ccc" },
      beginAtZero: true
    }
  }
};

  return (
    <>
      <Navbar />

      <div className="comparison-container">
        <h1>Model Comparison</h1>

        {/* 🏆 Best Model */}
        {bestModel && (
          <h2 className="best-model">
            🏆 Best Model: {bestModel.model} ({bestModel.accuracy})
          </h2>
        )}

        {/* 📊 TABLE */}
        <div className="table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>{row.model}</td>
                  <td>{row.accuracy}</td>
                  <td>{row.precision}</td>
                  <td>{row.recall}</td>
                  <td>{row.f1_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 📈 MAIN PERFORMANCE CHART */}
        <div className="chart-container">
          <h2>📊 Accuracy & F1 Score Comparison</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* 📉 EXTRA ANALYSIS IMAGES */}

        <div className="chart-container">
          <h2>📉 Precision vs Recall</h2>
          <img
            src="/images/precision_recall.png"
            alt="Precision vs Recall"
            className="chart-image"
          />
        </div>

        {/* 🧠 CONFUSION MATRICES */}

        <div className="chart-container">
          <h2>🧠 ResNet18 Confusion Matrix</h2>
          <img
            src="/images/resnet_cm.png"
            alt="ResNet Confusion Matrix"
            className="chart-image"
          />
        </div>

        <div className="chart-container">
          <h2>🧠 EfficientNet Confusion Matrix</h2>
          <img
            src="/images/efficientnet_cm.png"
            alt="EfficientNet Confusion Matrix"
            className="chart-image"
          />
        </div>

        <div className="chart-container">
          <h2>🧠 MobileNet Confusion Matrix</h2>
          <img
            src="/images/mobilenet_cm.png"
            alt="MobileNet Confusion Matrix"
            className="chart-image"
          />
        </div>

      </div>
    </>
  );
}

export default Comparison;