import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
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
  const navigate = useNavigate();

  // Fetch signup requests on component mount
  useEffect(() => {
    fetchSignupRequests();
  }, []);

  // Fetch all signup requests
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
        `${API_BASE_URL}/api/admin/signup-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setRequests(response.data.requests);
        setSelectedRows(new Set());
        setRemarks("");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        logout(true);
      } else {
        toast.error(
          error.response?.data?.message || "Failed to fetch signup requests"
        );
      }
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
    if (requests.length > 0 && selectedRows.size === requests.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(requests.map((req) => req._id));
      setSelectedRows(allIds);
    }
  };

  // View request details
  const handleViewRequest = (reqId) => {
    console.log("Request Details", reqId);
    toast.info("Request details displayed in console");
  };

  // Perform approve or reject action
  const performAction = async (action) => {
    // Validate remarks
    if (!remarks.trim()) {
      toast.error("Please enter remarks before proceeding.");
      return;
    }

    // Validate selection
    if (selectedRows.size === 0) {
      toast.warning("Please select at least one request.");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        toast.error("Session expired. Please log in again.");
        logout(true);
        return;
      }

      const requestIds = Array.from(selectedRows);

      const response = await axios.put(
        `${API_BASE_URL}/api/admin/signup-requests/update-status`,
        {
          requestIds,
          remarks: remarks.trim(),
          status: action === "approve" ? "approved" : "rejected",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const successMessage =
          action === "approve"
            ? "Request(s) approved successfully."
            : "Request(s) rejected successfully.";
        toast.success(successMessage);

        // Refresh the table data
        await fetchSignupRequests();
      }
    } catch (error) {
      console.error("Error performing action:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Session expired. Please log in again.");
        logout(true);
      } else {
        toast.error(
          error.response?.data?.message ||
            `Failed to ${action} request(s). Please try again.`
        );
      }
    } finally {
      setActionLoading(false);
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
            const id = request._id;
            const reqId = `REQ-${String(request._id).slice(-8).toUpperCase()}`;
            const requesterName = request.fullName || "-";
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
