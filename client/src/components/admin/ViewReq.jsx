import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/viewreq.css";

const API_BASE_URL = "http://localhost:3000";

export default function ViewReq() {
  const [requests, setRequests] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [remarks, setRemarks] = useState("");
  const { logout } = useContext(AuthContext);

  // Fetch signup requests on component mount
  useEffect(() => {
    fetchSignupRequests();
  }, []);

  const fetchSignupRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        logout(true);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/viewrequests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setRequests(response.data.data || []);
        setSelectedRows(new Set());
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch signup requests");
    } finally {
      setLoading(false);
    }
  };

  // Handle individual row selection
  const handleSelectRow = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedRows.size === requests.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = requests.map((req) => req.requestId);
      setSelectedRows(new Set(allIds));
    }
  };

  // Perform approve or reject action
  const performAction = async (action) => {
    if (!remarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }

    if (selectedRows.size === 0) {
      toast.error("Please select at least one request");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Session expired");
        logout(true);
        return;
      }

      const requestIds = Array.from(selectedRows);
      const endpoint =
        action === "approve"
          ? `${API_BASE_URL}/api/admin/requests/approve`
          : `${API_BASE_URL}/api/admin/requests/reject`;

      const response = await axios.put(
        endpoint,
        {
          requestIds,
          remarks: remarks.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          `${action === "approve" ? "Approved" : "Rejected"} successfully!`
        );
        setSelectedRows(new Set());
        setRemarks("");
        fetchSignupRequests(); // Refresh data
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to ${action} requests`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewRequest = async (requestId) => {
    if (!requestId) {
      toast.error("Invalid request ID");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Session expired");
        logout(true);
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/api/admin/requests/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const requestData = response.data.data;
        alert(
          `Name: ${requestData.fullName}\nEmail: ${requestData.email}\nStatus: ${requestData.status}`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch request details");
    }
  };

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
              onChange={handleSelectAll}
              title="Select all requests"
            />
          </div>
          <div className="table_entry">S.No</div>
          <div className="table_entry">Req ID</div>
          <div className="table_entry">Requester Name</div>
          <div className="table_entry">Email</div>
          <div className="table_entry">Status</div>
          <div className="table_entry">View Request</div>
        </div>

        {loading ? (
          <div className="requests-row loading-row">
            <div className="spinner"></div> Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="requests-row no-data">No requests found.</div>
        ) : (
          requests.map((request, index) => {
            const id = request.requestId;
            const reqId = `REQ-${String(id).slice(-8).toUpperCase()}`;
            const requesterName = request.fullName || "-";
            const email = request.email || "-";
            const status = request.status || "Pending";

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
                  <span
                    className={`status-badge status-${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div>
                <div className="table_entry">
                  <button
                    className="view_btn"
                    onClick={() => handleViewRequest(id)}
                  >
                    View
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
          placeholder="Enter remarks here (required for approval/rejection)"
          rows={4}
          disabled={actionLoading}
        />

        <div className="actions-buttons">
          <button
            className="btn-primary"
            onClick={() => performAction("approve")}
            disabled={actionLoading || selectedRows.size === 0}
            title={
              selectedRows.size === 0
                ? "Please select at least one request"
                : ""
            }
          >
            {actionLoading ? "Processing..." : "Approve"}
          </button>
          <button
            className="btn-danger"
            onClick={() => performAction("reject")}
            disabled={actionLoading || selectedRows.size === 0}
            title={
              selectedRows.size === 0
                ? "Please select at least one request"
                : ""
            }
          >
            {actionLoading ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}
