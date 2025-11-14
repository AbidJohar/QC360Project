import { useState } from "react";
import { FaEye } from "react-icons/fa";
import "../../styles/viewreq.css";

export default function ViewReq() {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const requestsData = [
    {
      id: 1,
      reqId: "REQ-001",
      requesterName: "John Doe",
      email: "john@example.com",
    },
    {
      id: 2,
      reqId: "REQ-002",
      requesterName: "Jane Smith",
      email: "jane@example.com",
    },
    {
      id: 3,
      reqId: "REQ-003",
      requesterName: "Ahmed Khan",
      email: "ahmed@example.com",
    },
    {
      id: 4,
      reqId: "REQ-004",
      requesterName: "Maria Garcia",
      email: "maria@example.com",
    },
    {
      id: 5,
      reqId: "REQ-005",
      requesterName: "Ali Hassan",
      email: "ali@example.com",
    },
    {
      id: 6,
      reqId: "REQ-006",
      requesterName: "Sarah Johnson",
      email: "sarah@example.com",
    },
  ];

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    newSelected.has(id) ? newSelected.delete(id) : newSelected.add(id);
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (e) => {
    setSelectedRows(
      e.target.checked ? new Set(requestsData.map((req) => req.id)) : new Set()
    );
  };

  const handleViewRequest = (reqId) => {
    alert(`Viewing details for ${reqId}`);
  };

  return (
    <div className="viewreq-container">
      <h2>View Requests</h2>
      <p className="subtitle">Manage and view all user requests</p>

      <div className="table_container">
        <div className="table_header">
          <div className="col-checkbox">
            <input
              type="checkbox"
              onChange={handleSelectAll}
              checked={
                selectedRows.size === requestsData.length &&
                requestsData.length > 0
              }
            />
          </div>
          <div className="table_entry">S.No</div>
          <div className="table_entry">Req ID</div>
          <div className="table_entry">Requester Name</div>
          <div className="table_entry">Email</div>
          <div className="table_entry">View Request</div>
        </div>

        {requestsData.map((request, index) => (
          <div
            key={request.id}
            className={`requests-row ${
              selectedRows.has(request.id) ? "selected" : ""
            }`}
          >
            <div className="col-checkbox">
              <input
                type="checkbox"
                checked={selectedRows.has(request.id)}
                onChange={() => handleSelectRow(request.id)}
              />
            </div>
            <div className="table_entry">{index + 1}</div>
            <div className="table_entry">{request.reqId}</div>
            <div className="table_entry">{request.requesterName}</div>
            <div className="table_entry">{request.email}</div>
            <div className="table_entry">
              <button
                className="view_btn"
                onClick={() => handleViewRequest(request.reqId)}
              >
                <FaEye /> View
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRows.size > 0 && (
        <div className="bulk-actions">
          <span>{selectedRows.size} item(s) selected</span>
          <div className="bulk-actions-warper">
            <button className="btn-primary">Export</button>
            <button className="btn-danger">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
