import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar.js";
import { FaSearch, FaFileImage, FaEye, FaTrash, FaHistory } from "react-icons/fa";
import "./History.css";

function History() {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch history from backend
  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error(err));
  }, []);

  // Filter + search
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

  const handleView = (item) => alert(`File: ${item.fileName}\nResult: ${item.result}\nConfidence: ${item.confidence}%`);
  const handleDelete = (item) => alert("For now delete is not implemented in DB");

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-container">
        <div className="history-header">
          <h1>Detection History</h1>
          <p>Review your previously analyzed images and their results</p>
        </div>

        {/* Stats */}
        <div className="stats-overview">
          <div className="stat-card stat-total"><div>{totalScans}</div><div>Total Scans</div></div>
          <div className="stat-card stat-real"><div>{realCount}</div><div>Authentic</div></div>
          <div className="stat-card stat-fake"><div>{fakeCount}</div><div>Deepfakes</div></div>
        </div>

        {/* Controls */}
        <div className="history-controls">
          <div className="search-box">
            <FaSearch />
            <input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                  <th>File</th><th>Date</th><th>Result</th><th>Confidence</th><th>Actions</th>
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
                      <button onClick={() => handleView(item)}><FaEye /> View</button>
                     {/* <button onClick={() => handleDelete(item)}><FaTrash /> Delete</button>*/}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state"><FaHistory /><p>No history found</p></div>
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
