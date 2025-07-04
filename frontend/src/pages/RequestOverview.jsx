import React, { useEffect, useState } from 'react';
import { getAllRequests, updateRequestStatus } from '../services/requestService';
import RequestModal from '../components/RequestModal';
import { useNavigate } from 'react-router-dom';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const RequestOverview = () => {
  const [requests, setRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to load requests:', err);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRequestStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const exportToExcel = () => {
    const rows = filteredRequests.map(r => ({
      Title: r.title,
      Vendor: r.vendorName,
      Total:  Number(r.totalCost),
      Status: r.status,
    }));
  
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Requests');
  
    const uint8 = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob  = new Blob([uint8], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'requests.xlsx');
  };

  const filteredRequests =
    filterStatus === 'All'
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const totalsByStatus = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + Number(r.totalCost);
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(totalsByStatus),
    datasets: [
      {
        label: 'Total Cost by Status (€)',
        data: Object.values(totalsByStatus),
        backgroundColor: ['#36a2eb', '#ffcd56', '#4bc0c0'],
      },
    ],
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Procurement Requests</h2>

      {/* Filter + Buttons */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Status Filter: </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option>All</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Closed</option>
        </select>

        <button onClick={exportToExcel} style={{ marginRight: '1rem' }}>
          ⬇️ Export as XLSX
        </button>

        <button onClick={() => navigate('/')}>← Back to Submit</button>
      </div>

      {/* Chart */}
      <div style={{ maxWidth: '600px', marginBottom: '2rem' }}>
        <Bar data={chartData} />
      </div>

      {/* Table */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Requestor</th>
            <th>Vendor</th>
            <th>Department</th>
            <th>Total Cost</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((r) => (
            <tr key={r.id} onClick={() => setSelectedRequest(r)} style={{ cursor: 'pointer' }}>
              <td>{r.title}</td>
              <td>{r.requestorName}</td>
              <td>{r.vendorName}</td>
              <td>{r.department}</td>
              <td>€{r.totalCost}</td>
              <td>
                <select
                  value={r.status}
                  onChange={(e) => handleStatusChange(r.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Modal */}
      <RequestModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};

export default RequestOverview;
