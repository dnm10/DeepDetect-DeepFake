import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.js";
import { useLocation } from "react-router-dom";
import {
  FaFilePdf,
  FaCheckCircle,
  FaChartBar,
  FaShieldAlt,
  FaClock,
  FaImage
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Reports.css";

function Reports() {

  const location = useLocation();

  const [reportData, setReportData] = useState(location.state || null);
  const [history, setHistory] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  // Load report history
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("reports")) || [];
    setHistory(saved);

    if (!reportData && saved.length > 0) {
      setReportData(saved[0]);
    }
  }, []);

  useEffect(() => {

  const fetchAnalysis = async () => {

    if (!reportData) return;

    try {

      const formData = new FormData();
      formData.append("file", reportData.file);

      const response = await fetch("http://localhost:8000/generate-report/", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      setAnalysis(data);

    } catch (err) {

      console.log("Analysis error:", err);

    }

  };

  fetchAnalysis();

}, [reportData]);

  const handleDownload = () => {

    if (!reportData) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Deepfake Detection Analysis Report", 14, 20);

    doc.setFontSize(12);
    doc.text(`File Name: ${reportData.fileName}`, 14, 40);
    doc.text(`Prediction: ${reportData.prediction}`, 14, 50);
    doc.text(`Confidence: ${reportData.confidence}%`, 14, 60);
    doc.text(`Model Used: ${reportData.model}`, 14, 70);
    doc.text(`Detection Time: ${reportData.inference_time}s`, 14, 80);
    doc.text(`Resolution: ${reportData.width} x ${reportData.height}`, 14, 90);

    if (analysis) {
        doc.addPage();
        doc.text("GradCAM Heatmap", 14, 20);

        doc.addImage(
          `data:image/png;base64,${analysis.gradcam}`,
          "PNG",
          15,
          30,
          180,
          100
        );

        doc.addPage();
        doc.text("FFT Frequency Analysis", 14, 20);

        doc.addImage(
          `data:image/png;base64,${analysis.fft}`,
          "PNG",
          15,
          30,
          180,
          100
        );

      }

    doc.save(`${reportData.fileName}_report.pdf`);
  };

  if (!reportData) {
    return (
      <div className="reports-page">
        <Navbar />
        <div className="reports-container">
          <h2>No reports available</h2>
          <p>Please run detection from Upload page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">

      <Navbar />

      <div className="reports-container">

        <div className="reports-header">
          <h1 className="reports-title">Deepfake Detection Report</h1>
        </div>

        {/* Uploaded Image */}

        <div className="uploaded-image-card">
          <h3>Uploaded Image</h3>
          <img
            src={reportData.image_url}
            alt="uploaded"
            className="uploaded-image"
          />
        </div>

        {/* Prediction Summary */}

        <div className="report-preview-card">

          <div className="preview-header">
            <FaCheckCircle
              style={{ color: "#00ff88", fontSize: "3rem" }}
            />
            <h3>Prediction Summary</h3>
          </div>

          <div className="report-details">

            <div className="detail-item">
              <span>File Name</span>
              <span>{reportData.fileName}</span>
            </div>

            <div className="detail-item">
              <span>Model</span>
              <span>{reportData.model}</span>
            </div>

            <div className="detail-item">
              <span>Prediction</span>
              <span className={
                reportData.prediction === "Fake"
                ? "badge-fake"
                : "badge-real"
              }>
                {reportData.prediction}
              </span>
            </div>

            <div className="detail-item">
              <span>Detection Time</span>
              <span>{reportData.inference_time}s</span>
            </div>

            <div className="detail-item">
              <span>Resolution</span>
              <span>{reportData.width} × {reportData.height}</span>
            </div>

          </div>

          {/* Confidence */}

          <div className="confidence-meter">

            <div className="confidence-header">
              <span>Confidence</span>
              <span>{reportData.confidence}%</span>
            </div>

            <div className="confidence-bar">
              <div
                className="confidence-fill"
                style={{ width: `${reportData.confidence}%` }}
              />
            </div>

          </div>

        </div>

        {/* Probability */}

        <div className="analysis-section">

          <h3><FaChartBar /> Probability</h3>

          <p>Fake: {reportData.fake_prob}%</p>
          <p>Real: {reportData.real_prob}%</p>

        </div>

        {/* GradCAM */}

        {analysis && (

          <div className="analysis-section">

            <h3>GradCAM Heatmap</h3>

            <img
              src={`data:image/png;base64,${analysis.gradcam}`}
              alt="GradCAM"
              className="analysis-image"
            />

          </div>

        )}

        {/* FFT */}

        {analysis && (

          <div className="analysis-section">

            <h3>FFT Frequency Analysis</h3>

            <img
              src={`data:image/png;base64,${analysis.fft}`}
              alt="FFT"
              className="analysis-image"
            />

          </div>

        )}

        {/* Download */}

        <div className="report-actions">

          <button className="download-btn" onClick={handleDownload}>
            <FaFilePdf /> Download PDF Report
          </button>

        </div>

        {/* History */}

        <div className="analysis-section">

          <h3>Detection History</h3>

          <div className="history-grid">

            {history.map((item, index) => (

              <div
                key={index}
                className="history-card"
                onClick={() => setReportData(item)}
              >

                <img src={item.image_url} alt="history" />

                <p>{item.fileName}</p>

                <p>{item.prediction}</p>

                <p>{item.confidence}%</p>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;