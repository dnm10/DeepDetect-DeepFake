import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar.js";
import { FaSearch, FaFileImage, FaTrash, FaFilePdf, FaHistory } from "react-icons/fa";
import "./History.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function History() {

  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch history
  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter
  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.fileName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || item.result.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  // Stats
  const totalScans = history.length;
  const realCount = history.filter((item) => item.result === "Real").length;
  const fakeCount = history.filter((item) => item.result === "Fake").length;

  /* =========================
     DOWNLOAD PDF (SIMPLIFIED)
  ========================= */
 const handleDownload = async (item) => {

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // TITLE
  doc.setFontSize(20);
  doc.text("Deepfake Detection Report", pageWidth / 2, 20, { align: "center" });

  // RESULT
  doc.setFontSize(14);
  if (item.result === "Fake") {
    doc.setTextColor(200, 0, 0);
    doc.text("FAKE IMAGE DETECTED", pageWidth / 2, 30, { align: "center" });
  } else {
    doc.setTextColor(0, 150, 0);
    doc.text("AUTHENTIC IMAGE", pageWidth / 2, 30, { align: "center" });
  }
  doc.setTextColor(0, 0, 0);

  // UPLOADED IMAGE
  if (item.image_url) {
    doc.addImage(item.image_url, "JPEG", 40, 40, 120, 80);
  }

  // TABLE
  autoTable(doc, {
    startY: 130,
    head: [["Parameter", "Value"]],
    body: [
      ["File Name", item.fileName || "N/A"],
      ["Prediction", item.result || "N/A"],
      ["Confidence", (item.confidence || 0) + "%"],
      ["Model", item.model || "N/A"],
      ["Resolution", `${item.width || 0} x ${item.height || 0}`],
      ["Inference Time", (item.inference_time || 0) + " s"],
      ["Fake Probability", (item.fake_prob || 0) + "%"],
      ["Real Probability", (item.real_prob || 0) + "%"]
    ]
  });

  // RE-GENERATE AI ANALYSIS from stored image_url by calling /generate-report/
  // This works because image_url is stored as a base64 data URL
  let analysis = {};
  const isVideo = item.model && item.model.toLowerCase().includes("video");

  if (!isVideo && item.image_url && item.image_url.startsWith("data:image")) {
    try {
      // Convert base64 data URL back to a Blob so we can POST it as a file
      const res = await fetch(item.image_url);
      const blob = await res.blob();
      const formData = new FormData();
      formData.append("file", blob, item.fileName || "image.jpg");

      const analysisRes = await fetch("http://localhost:8000/generate-report/", {
        method: "POST",
        body: formData
      });
      analysis = await analysisRes.json();
    } catch (err) {
      console.log("Re-analysis failed (PDF will have text only):", err);
    }
  }

  // PAGE 2 — AI Analysis (images only)
  if (!isVideo && (analysis.gradcam || analysis.face_heatmap || analysis.fft || analysis.prob_chart)) {
    doc.addPage();
    doc.setFontSize(16);
    doc.text("AI Analysis", 14, 20);

    if (analysis.gradcam) {
      doc.text("GradCAM", 14, 30);
      doc.addImage(`data:image/png;base64,${analysis.gradcam}`, "PNG", 14, 35, 80, 80);
    }
    if (analysis.face_heatmap) {
      doc.text("Face Heatmap", 110, 30);
      doc.addImage(`data:image/png;base64,${analysis.face_heatmap}`, "PNG", 110, 35, 80, 80);
    }
    if (analysis.fft) {
      doc.text("FFT", 14, 125);
      doc.addImage(`data:image/png;base64,${analysis.fft}`, "PNG", 14, 130, 80, 80);
    }
    if (analysis.prob_chart) {
      doc.text("Probability Chart", 110, 125);
      doc.addImage(`data:image/png;base64,${analysis.prob_chart}`, "PNG", 110, 130, 80, 80);
    }
  }

  // PAGE 3 — Confidence Gauge
  if (!isVideo && analysis.confidence_gauge) {
    doc.addPage();
    doc.text("Confidence Gauge", 14, 20);
    doc.addImage(`data:image/png;base64,${analysis.confidence_gauge}`, "PNG", 14, 30, 180, 90);
  }

  doc.save(`${item.fileName}_Full_Report.pdf`);
};


  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {

    try {
      await fetch(`http://localhost:5000/history/${id}`, {
        method: "DELETE"
      });

      // remove from UI
      setHistory(history.filter((item) => item.id !== id));

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="history-page">
      <Navbar />

      <div className="history-container">

        <div className="history-header">
          <h1>Detection History</h1>
          <p>Review your previously analyzed images</p>
        </div>

        {/* Stats */}
        <div className="stats-overview">
          <div className="stat-card stat-total"><div>{totalScans}</div><div>Total</div></div>
          <div className="stat-card stat-real"><div>{realCount}</div><div>Real</div></div>
          <div className="stat-card stat-fake"><div>{fakeCount}</div><div>Fake</div></div>
        </div>

        {/* Controls */}
        <div className="history-controls">
          <div className="search-box">
            <FaSearch />
            <input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons">
            <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
            <button className={filter === "real" ? "active" : ""} onClick={() => setFilter("real")}>Real</button>
            <button className={filter === "fake" ? "active" : ""} onClick={() => setFilter("fake")}>Fake</button>
          </div>
        </div>

        {/* Table */}
        <div className="history-table-container">

          {paginatedHistory.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Date</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedHistory.map((item) => (
                  <tr key={item.id}>
                    <td><FaFileImage /> {item.fileName}</td>
                    <td>{new Date(item.date).toLocaleString()}</td>
                    <td>{item.result}</td>
                    <td>{item.confidence}%</td>
                    <td>
                      <button onClick={() => handleDownload(item)}>
                        <FaFilePdf /> Download
                      </button>

                      <button onClick={() => handleDelete(item.id)}>
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          ) : (
            <div className="empty-state">
              <FaHistory />
              <p>No history found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
              <span>Page {currentPage} of {totalPages}</span>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default History;
