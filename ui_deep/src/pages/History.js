import React, { useState } from "react";
import Navbar from "../Components/Navbar.js";
import { 
  FaSearch, 
  FaFileImage, 
  FaEye, 
  FaTrash, 
  FaDownload,
  FaFilter,
  FaHistory 
} from "react-icons/fa";
import "./History.css";

function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const mockHistory = [
    {
      id: 1,
      filename: "profile_photo.jpg",
      date: "2024-03-15",
      time: "14:30",
      result: "Fake",
      confidence: 97,
      fileSize: "2.4 MB",
      type: "JPEG"
    },
    {
      id: 2,
      filename: "vacation_pic.png",
      date: "2024-03-14",
      time: "09:15",
      result: "Real",
      confidence: 91,
      fileSize: "3.1 MB",
      type: "PNG"
    },
    {
      id: 3,
      filename: "document.jpg",
      date: "2024-03-13",
      time: "16:45",
      result: "Fake",
      confidence: 88,
      fileSize: "1.8 MB",
      type: "JPEG"
    },
    {
      id: 4,
      filename: "selfie.png",
      date: "2024-03-12",
      time: "11:20",
      result: "Real",
      confidence: 95,
      fileSize: "2.7 MB",
      type: "PNG"
    },
    {
      id: 5,
      filename: "group_photo.jpg",
      date: "2024-03-11",
      time: "18:30",
      result: "Fake",
      confidence: 82,
      fileSize: "4.2 MB",
      type: "JPEG"
    },
    {
      id: 6,
      filename: "landscape.png",
      date: "2024-03-10",
      time: "10:15",
      result: "Real",
      confidence: 89,
      fileSize: "5.1 MB",
      type: "PNG"
    }
  ];

  // Filter and search logic
  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || item.result.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage);

  // Stats calculation
  const totalScans = mockHistory.length;
  const realCount = mockHistory.filter(item => item.result === "Real").length;
  const fakeCount = mockHistory.filter(item => item.result === "Fake").length;

  const handleViewDetails = (item) => {
    alert(`Viewing details for: ${item.filename}\nResult: ${item.result}\nConfidence: ${item.confidence}%`);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete ${item.filename} from history?`)) {
      alert(`${item.filename} deleted from history`);
    }
  };

  const handleDownloadReport = (item) => {
    alert(`Downloading report for: ${item.filename}`);
  };

  return (
    <div className="history-page">
      <Navbar />
      
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <h1 className="history-title">Detection History</h1>
          <p className="history-subtitle">
            Review your previously analyzed images and their deepfake detection results
          </p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card stat-total">
            <div className="stat-value">{totalScans}</div>
            <div className="stat-label">Total Scans</div>
          </div>
          <div className="stat-card stat-real">
            <div className="stat-value">{realCount}</div>
            <div className="stat-label">Authentic Content</div>
          </div>
          <div className="stat-card stat-fake">
            <div className="stat-value">{fakeCount}</div>
            <div className="stat-label">Deepfakes Detected</div>
          </div>
        </div>

        {/* Controls */}
        <div className="history-controls">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'real' ? 'active' : ''}`}
              onClick={() => setFilter('real')}
            >
              Real
            </button>
            <button 
              className={`filter-btn ${filter === 'fake' ? 'active' : ''}`}
              onClick={() => setFilter('fake')}
            >
              Fake
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="history-table-container">
          {paginatedHistory.length > 0 ? (
            <>
              <table className="history-table">
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Result</th>
                    <th>Confidence</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="file-cell">
                          <FaFileImage className="file-icon" />
                          <span className="file-name">{item.filename}</span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div>{item.date}</div>
                          <div style={{ fontSize: '0.8rem', color: '#8fa3bf' }}>{item.time}</div>
                        </div>
                      </td>
                      <td>{item.type}</td>
                      <td>
                        <span className={`result-badge ${item.result === 'Fake' ? 'fake-result' : 'real-result'}`}>
                          {item.result}
                        </span>
                      </td>
                      <td>
                        <div className="confidence-cell">
                          <span>{item.confidence}%</span>
                          <div className="confidence-bar">
                            <div 
                              className="confidence-fill"
                              style={{ width: `${item.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button 
                            className="action-btn view-btn"
                            onClick={() => handleViewDetails(item)}
                          >
                            <FaEye /> View
                          </button>
                          <button 
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(item)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  
                  <span className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button 
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <FaHistory className="empty-icon" />
              <h3>No history found</h3>
              <p>No analysis results match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default History;