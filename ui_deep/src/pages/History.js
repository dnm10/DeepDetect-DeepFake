import React from "react";
import Navbar from "../Components/Navbar.js";
import "./History.css";

function History() {
  const mockHistory = [
    {
      id: 1,
      filename: "deepfake_img1.jpg",
      date: "2025-10-08",
      result: "Fake",
      confidence: "97%",
    },
    {
      id: 2,
      filename: "real_image.jpg",
      date: "2025-10-07",
      result: "Real",
      confidence: "91%",
    },
    {
      id: 3,
      filename: "suspected_img.jpg",
      date: "2025-10-06",
      result: "Fake",
      confidence: "88%",
    },
  ];

  return (
    <div className="history-page">
      <Navbar />
      <div className="history-container fade-in">
        <h2>Deepfake Detection History</h2>
        <p>Review your previously uploaded media and their detection results.</p>

        <table className="history-table">
          <thead>
            <tr>
              <th>#</th>
              <th>File Name</th>
              <th>Date</th>
              <th>Result</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {mockHistory.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.filename}</td>
                <td>{item.date}</td>
                <td
                  className={
                    item.result === "Fake" ? "fake-result" : "real-result"
                  }
                >
                  {item.result}
                </td>
                <td>{item.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default History;
