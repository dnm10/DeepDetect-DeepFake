import React, { useState } from "react";
import Navbar from "../Components/Navbar.js";
import "./Reports.css";

function Reports() {
  const [selectedItem, setSelectedItem] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  const historyData = [
    { id: 1, fileName: "deepfake_img1.png", date: "2025-10-08", result: "Fake" },
    { id: 2, fileName: "real_image.png", date: "2025-10-05", result: "Real" },
    { id: 3, fileName: "suspected_image.png", date: "2025-10-03", result: "Fake" },
  ];

  const handleGenerate = () => {
    if (selectedItem) {
      setIsGenerated(true);
    }
  };

  return (
    <div className="reports-page">
      <Navbar />
      <div className="reports-container">
        <h2>Generate DeepFake Analysis Report</h2>
        <p>Select a previously analyzed file and generate a detailed report.</p>

        <div className="report-card">
          <label htmlFor="select-item" className="report-label">
            Choose File:
          </label>
          <select
            id="select-item"
            className="report-select"
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
          >
            <option value="">-- Select File --</option>
            {historyData.map((item) => (
              <option key={item.id} value={item.fileName}>
                {item.fileName} ({item.result} - {item.date})
              </option>
            ))}
          </select>

          <button
            className="generate-btn"
            onClick={handleGenerate}
            disabled={!selectedItem}
          >
            Generate Report
          </button>

          {isGenerated && (
            <div className="report-preview fade-in">
              <h3>✅ Report Generated Successfully</h3>
              <p>
                Report for <strong>{selectedItem}</strong> has been created.
              </p>
              <button className="download-btn">Download Report</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
