import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar.js";
import { useLocation } from "react-router-dom";
import { FaFilePdf, FaCheckCircle } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Reports.css";

function Reports() {

  const location = useLocation();

  const [reportData, setReportData] = useState(location.state || null);
  const [history, setHistory] = useState([]);

  useEffect(() => {

    const saved = JSON.parse(localStorage.getItem("reports")) || [];

    setHistory(saved);

    if (!reportData && saved.length > 0) {
      setReportData(saved[0]);
    }

  }, [reportData]);


  /* =============================
        DOWNLOAD PDF
  ============================= */

  const handleDownload = async () => {

    if (!reportData) return;

    try {

      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      /* ==========================
        Convert uploaded image
      ========================== */

      const getBase64Image = (url) => {
        return new Promise((resolve) => {

          const img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = url;

          img.onload = () => {

            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            resolve(canvas.toDataURL("image/jpeg"));
          };
        });
      };

      const uploadedImage = await getBase64Image(reportData.image_url);

      /* ==========================
        CALL BACKEND FOR ANALYSIS
      ========================== */

      const formData = new FormData();
      formData.append("file", reportData.file);

      const response = await fetch("http://localhost:8000/generate-report/", {
        method: "POST",
        body: formData
      });

      const analysis = await response.json();

      if (!analysis.gradcam) {
        alert("Backend analysis failed");
        return;
      }

      /* ==========================
        PAGE 1
      ========================== */

      doc.setFontSize(22);
      doc.text("Deepfake Detection Analysis Report", pageWidth / 2, 20, { align: "center" });

      doc.setFontSize(10);
      doc.text("AI Powered Image Forgery Detection System", pageWidth / 2, 28, { align: "center" });

      doc.line(10, 32, 200, 32);

      /* RESULT BANNER */

      doc.setFontSize(14);

      if (reportData.prediction === "Fake") {

        doc.setTextColor(200, 0, 0);
        doc.text("RESULT: FAKE IMAGE DETECTED", pageWidth / 2, 40, { align: "center" });

      } else {

        doc.setTextColor(0, 150, 0);
        doc.text("RESULT: AUTHENTIC IMAGE", pageWidth / 2, 40, { align: "center" });

      }

      doc.setTextColor(0, 0, 0);

      /* Uploaded Image */

      doc.setFontSize(14);
      doc.text("Uploaded Image", 14, 55);

      doc.addImage(
        uploadedImage,
        "JPEG",
        40,
        60,
        120,
        80
      );

      /* Detection Summary */

      doc.setFontSize(14);
      doc.text("Detection Summary", 14, 150);

      autoTable(doc, {
        startY: 155,
        head: [["Parameter", "Value"]],
        body: [
          ["File Name", reportData.fileName],
          ["Prediction", reportData.prediction],
          ["Confidence Score", reportData.confidence + "%"],
          ["Model Used", reportData.model],
          ["Detection Time", reportData.inference_time + " s"],
          ["Resolution", reportData.width + " x " + reportData.height],
          ["Fake Probability", reportData.fake_prob + "%"],
          ["Real Probability", reportData.real_prob + "%"]
        ],
      });


      /* ==========================
        PAGE 2 - AI FORENSICS
      ========================== */

      doc.addPage();

      doc.setFontSize(18);
      doc.text("AI Forensic Analysis", 14, 20);

      /* GradCAM */

      doc.setFontSize(12);
      doc.text("GradCAM Attention Map", 14, 35);

      doc.addImage(`data:image/png;base64,${analysis.gradcam}`, "PNG", 14, 40, 85, 85);

      doc.setFontSize(9);
      doc.text(
        "Highlights regions the AI focused on while making the prediction.",
        14,
        130
      );

      /* Face Heatmap */

      doc.setFontSize(12);
      doc.text("Face Heatmap", 110, 35);

      doc.addImage(`data:image/png;base64,${analysis.face_heatmap}`, "PNG", 110, 40, 85, 85);

      doc.setFontSize(9);
      doc.text(
        "Shows facial areas where manipulation artifacts may exist.",
        110,
        130
      );

      /* FFT */

      doc.setFontSize(12);
      doc.text("Frequency Spectrum (FFT)", 14, 145);

      doc.addImage(`data:image/png;base64,${analysis.fft}`, "PNG", 14, 150, 85, 85);

      doc.setFontSize(9);
      doc.text(
        "Frequency spectrum revealing abnormal pixel patterns.",
        14,
        240
      );

      /* Probability Chart */

      doc.setFontSize(12);
      doc.text("Prediction Probability", 110, 145);

      doc.addImage(`data:image/png;base64,${analysis.prob_chart}`, "PNG", 110, 150, 85, 85);

      doc.setFontSize(9);
      doc.text(
        "Probability distribution of the model prediction.",
        110,
        240
      );


      /* ==========================
        PAGE 3 - CONFIDENCE
      ========================== */

      doc.addPage();

      doc.setFontSize(18);
      doc.text("Model Confidence", 14, 20);

      doc.addImage(`data:image/png;base64,${analysis.confidence_gauge}`, "PNG", 14, 30, 180, 90);


      /* ==========================
        PAGE 4 - INTERPRETATION
      ========================== */

      // doc.addPage();

      // doc.setFontSize(18);
      // doc.text("Analysis Explanation", 14, 20);

      // doc.setFontSize(11);

      // doc.text(
      // `GradCAM Visualization identifies the regions of the image that most influenced the model's prediction.

      // Face Heatmap highlights facial regions where abnormal smoothing or blending artifacts may appear.

      // Frequency Spectrum (FFT) analysis reveals irregular frequency patterns that are often associated with manipulated or synthetically generated images.

      // Prediction Probability represents the model's confidence distribution for classifying the image as either real or fake.

      // Together, these forensic visualizations provide supporting evidence for the model's final prediction.`,
      // 14,
      // 40
      // );


      /* ==========================
        FOOTER
      ========================== */

      const pageCount = doc.getNumberOfPages();

      for (let i = 1; i <= pageCount; i++) {

        doc.setPage(i);

        doc.setFontSize(9);

        doc.text(
          "Generated by Deepfake Detection System",
          pageWidth / 2,
          290,
          { align: "center" }
        );
      }


      /* ==========================
        SAVE PDF
      ========================== */

      doc.save(`${reportData.fileName}_Deepfake_Report.pdf`);

    } catch (err) {

      console.error(err);
      alert("Report generation failed");

    }

  };


  if (!reportData) {

    return (
      <div className="reports-page">
        <Navbar />
        <div className="reports-container">
          <h2>No Reports Available</h2>
        </div>
      </div>
    );

  }

  return (

    <div className="reports-page">

      <Navbar />

      <div className="reports-container">

        <h1 className="reports-title">Deepfake Detection Report</h1>

        <div className="uploaded-image-card">

          <h3>Uploaded Image</h3>

          <img
            src={reportData.image_url}
            alt="uploaded"
            className="uploaded-image"
          />

        </div>

        <div className="report-preview-card">

          <div className="preview-header">

            <FaCheckCircle style={{ color: "#00ff88", fontSize: "3rem" }} />

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
              <span>{reportData.prediction}</span>
            </div>

            <div className="detail-item">
              <span>Detection Time</span>
              <span>{reportData.inference_time}s</span>
            </div>

            <div className="detail-item">
              <span>Resolution</span>
              <span>{reportData.width} x {reportData.height}</span>
            </div>

          </div>

        </div>

        <div className="report-actions">

          <button className="download-btn" onClick={handleDownload}>
            <FaFilePdf /> Download PDF Report
          </button>

        </div>

        <div className="analysis-section">

          <h3>Detection History</h3>

          <table className="history-table">

            <thead>
              <tr>
                <th>File Name</th>
                <th>Prediction</th>
                <th>Open</th>
              </tr>
            </thead>

            <tbody>

              {history.length === 0 ? (
                <tr>
                  <td colSpan="3">No detection history</td>
                </tr>
              ) : (
                history.map((item, index) => (
                  <tr key={index}>
                    <td>{item.fileName}</td>
                    <td>{item.prediction}</td>
                    <td>
                      <button
                        onClick={() => setReportData(item)}
                        className="history-download"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

export default Reports;