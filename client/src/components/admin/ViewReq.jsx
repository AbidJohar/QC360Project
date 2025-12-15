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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalRemarks, setModalRemarks] = useState("");
  const [modalActionLoading, setModalActionLoading] = useState(false);
  const { logout } = useContext(AuthContext);

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

  const handleSelectRow = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === requests.length) {
      setSelectedRows(new Set());
    } else {
      const allIds = requests.map((req) => req.requestId);
      setSelectedRows(new Set(allIds));
    }
  };

  const performAction = async (action) => {
    if (!remarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }

    if (remarks.trim().length < 8) {
      toast.error("Remarks must be at least 8 characters");
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
        const count = requestIds.length;
        toast.success(
          `${count} request${count > 1 ? "s" : ""} ${
            action === "approve" ? "approved" : "rejected"
          } successfully!`
        );

        // Remove requests from the list for both approve and reject
        const updatedRequests = requests.filter(
          (req) => !requestIds.includes(req.requestId || req._id)
        );
        setRequests(updatedRequests);

        setSelectedRows(new Set());
        setRemarks("");
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
        setSelectedRequest(requestData);
        setModalRemarks("");
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to fetch request details");
    }
  };

  const handleModalAction = async (action) => {
    if (!modalRemarks.trim()) {
      toast.error("Please enter remarks");
      return;
    }

    if (modalRemarks.trim().length < 8) {
      toast.error("Remarks must be at least 8 characters");
      return;
    }

    setModalActionLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        toast.error("Session expired");
        logout(true);
        return;
      }

      const endpoint =
        action === "approve"
          ? `${API_BASE_URL}/api/admin/requests/approve`
          : `${API_BASE_URL}/api/admin/requests/reject`;

      const response = await axios.put(
        endpoint,
        {
          requestIds: [selectedRequest.requestId || selectedRequest._id],
          remarks: modalRemarks.trim(),
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
          `Request ${
            action === "approve" ? "approved" : "rejected"
          } successfully!`
        );

        // Remove request from the list for both approve and reject
        const updatedRequests = requests.filter(
          (req) =>
            (req.requestId || req._id) !==
            (selectedRequest.requestId || selectedRequest._id)
        );
        setRequests(updatedRequests);

        setShowDetailModal(false);
        setSelectedRequest(null);
        setModalRemarks("");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Failed to ${action} request`);
    } finally {
      setModalActionLoading(false);
    }
  };

  return (
    <div className="viewreq-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>View Requests</h2>
      <p className="subtitle">Manage and view all user requests</p>

      <div className="table_container">
        <div className="table_header">
          <div className="table_entry">S.No</div>
          <div className="table_entry">Req ID</div>
          <div className="table_entry">Requester Name</div>
          <div className="table_entry">Email</div>
          <div className="table_entry">View Request</div>
          {/* <div className="table_entry">Status</div> */}
          <div className="table_entry">
            <input
              type="checkbox"
              checked={
                requests.length > 0 && selectedRows.size === requests.length
              }
              onChange={handleSelectAll}
              title="Select all requests"
            />
          </div>
        </div>

        {loading ? (
          <div className="requests-row loading-row">
            <div className="spinner"></div> Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="requests-row no-data">No requests found.</div>
        ) : (
          requests.map((request, index) => {
            const id = request.requestId || request._id;
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
                <div className="table_entry">{index + 1}</div>
                <div className="table_entry">{id}</div>
                <div className="table_entry">{requesterName}</div>
                <div className="table_entry">{email}</div>
                <div className="table_entry">
                  <button
                    className="view_btn"
                    onClick={() => handleViewRequest(id)}
                  >
                    View
                  </button>
                </div>
                {/* <div className="table_entry">
                  <span
                    className={`status-badge status-${status.toLowerCase()}`}
                  >
                    {status}
                  </span>
                </div> */}

                <div className="table_entry">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(id)}
                    onChange={() => handleSelectRow(id)}
                  />
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
          onChange={(e) => setRemarks(e.target.value.slice(0, 200))}
          placeholder="Enter remarks here (required for approval/rejection)"
          rows={4}
          maxLength={200}
          disabled={actionLoading}
        />
        <div className="char-count">{remarks.length}/200 characters</div>

        <div className="actions-buttons">
          <button
            className="btn-primary"
            onClick={() => performAction("approve")}
            disabled={
              actionLoading ||
              selectedRows.size === 0 ||
              remarks.trim().length < 8
            }
            title={
              selectedRows.size === 0
                ? "Please select at least one request"
                : remarks.trim().length < 8
                ? "Remarks must be at least 8 characters"
                : ""
            }
          >
            {actionLoading ? "Processing..." : "Approve"}
          </button>
          <button
            className="btn-danger"
            onClick={() => performAction("reject")}
            disabled={
              actionLoading ||
              selectedRows.size === 0 ||
              remarks.trim().length < 8
            }
            title={
              selectedRows.size === 0
                ? "Please select at least one request"
                : remarks.trim().length < 8
                ? "Remarks must be at least 8 characters"
                : ""
            }
          >
            {actionLoading ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>

      {showDetailModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>View Request Details</h3>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
                disabled={modalActionLoading}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="request-detail-row">
                <label>Request ID:</label>
                <span>{selectedRequest.requestId || selectedRequest._id}</span>
              </div>
              <div className="request-detail-row">
                <label>Full Name:</label>
                <span>{selectedRequest.fullName || "-"}</span>
              </div>
              <div className="request-detail-row">
                <label>Email:</label>
                <span>{selectedRequest.email || "-"}</span>
              </div>
              <div className="request-detail-row">
                <label>Status:</label>
                <span
                  className={`status-badge status-${(
                    selectedRequest.status || "pending"
                  ).toLowerCase()}`}
                >
                  {selectedRequest.status || "Pending"}
                </span>
              </div>
              {selectedRequest.submittedAt && (
                <div className="request-detail-row">
                  <label>Submitted At:</label>
                  <span>
                    {new Date(selectedRequest.submittedAt).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="modal-remarks">
                <label htmlFor="modal-remarks">Remarks:</label>
                <textarea
                  id="modal-remarks"
                  value={modalRemarks}
                  onChange={(e) =>
                    setModalRemarks(e.target.value.slice(0, 100))
                  }
                  placeholder="Enter remarks (required for approval/rejection)"
                  rows={4}
                  maxLength={200}
                  disabled={modalActionLoading}
                />
                <div className="char-count">
                  {modalRemarks.length}/200 characters
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-primary"
                onClick={() => handleModalAction("approve")}
                disabled={
                  modalActionLoading ||
                  !modalRemarks.trim() ||
                  modalRemarks.trim().length < 8
                }
              >
                {modalActionLoading ? "Processing..." : "Approve"}
              </button>
              <button
                className="btn-danger"
                onClick={() => handleModalAction("reject")}
                disabled={
                  modalActionLoading ||
                  !modalRemarks.trim() ||
                  modalRemarks.trim().length < 8
                }
              >
                {modalActionLoading ? "Processing..." : "Reject"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowDetailModal(false)}
                disabled={modalActionLoading}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
