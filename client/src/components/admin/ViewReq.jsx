import { useState, useEffect } from "react";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/viewreq.css";

export default function ViewReq() {
  const [requests, setRequests] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState("");

  return (
    <div className="viewreq-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>View Requests</h2>
      <p className="subtitle">Manage and view all user requests</p>

      <div className="table_container">
        <div className="table_header">
          <div className="col-checkbox">
            <input
              type="checkbox"
              checked={
                requests.length > 0 && selectedRows.size === requests.length
              }
            />
          </div>
          <div className="table_entry">S.No</div>
          <div className="table_entry">Req ID</div>
          <div className="table_entry">Requester Name</div>
          <div className="table_entry">Email</div>
          <div className="table_entry">View Request</div>
        </div>

        {loading ? (
          <div className="requests-row">Loading...</div>
        ) : requests.length === 0 ? (
          <div className="requests-row">No requests found.</div>
        ) : (
          requests.map((request, index) => {
            const id = request.id || request._id || request.reqId || index + 1;
            const reqId =
              request.reqId ||
              request.requestId ||
              request._id ||
              `REQ-${index + 1}`;
            const requesterName =
              request.fullName ||
              request.requesterName ||
              request.username ||
              "-";
            const email = request.email || "-";

            return (
              <div
                key={id}
                className={`requests-row ${
                  selectedRows.has(id) ? "selected" : ""
                }`}
              >
                <div className="col-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(id)}
                    onChange={() => handleSelectRow(id)}
                  />
                </div>
                <div className="table_entry">{index + 1}</div>
                <div className="table_entry">{reqId}</div>
                <div className="table_entry">{requesterName}</div>
                <div className="table_entry">{email}</div>
                <div className="table_entry">
                  <button
                    className="view_btn"
                    onClick={() => handleViewRequest(reqId)}
                  >
                    <FaEye /> View
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="actions-section">
        <label htmlFor="remarks">Remarks:</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks here"
          rows={4}
        />

        <div className="actions-buttons">
          <button
            className="btn-primary"
            onClick={() => performAction("approve")}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Approve"}
          </button>
          <button
            className="btn-danger"
            onClick={() => performAction("reject")}
            disabled={actionLoading}
          >
            {actionLoading ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
