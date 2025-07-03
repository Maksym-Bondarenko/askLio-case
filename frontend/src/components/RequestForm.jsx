import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestForm = () => {
  const navigate = useNavigate();

  const [previewData, setPreviewData] = useState(null);

  const [form, setForm] = useState({
    requestorName: '',
    title: '',
    vendorName: '',
    vatId: '',
    department: '',
    totalCost: '',
    orderLines: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrderLineChange = (index, field, value) => {
    const newLines = [...form.orderLines];
    newLines[index][field] = value;
    setForm({ ...form, orderLines: newLines });
  };

  const addOrderLine = () => {
    setForm({
      ...form,
      orderLines: [...form.orderLines, { description: '', unitPrice: '', amount: '', unit: '', totalPrice: '' }]
    });
  };

  const removeOrderLine = (index) => {
    const updatedLines = [...form.orderLines];
    updatedLines.splice(index, 1);
    setForm({ ...form, orderLines: updatedLines });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('pdf', file);
  
    try {
      const response = await axios.post('http://localhost:3000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      console.log("Parsed data:", response.data);
      setPreviewData(response.data); // 🔍 set preview
      alert("Data extracted. Preview below — confirm to apply.");
    } catch (err) {
      console.error("Error parsing PDF:", err);
      alert("Failed to extract data from PDF.");
    }
  };
  
  const validateForm = () => {
    const requiredFields = ['requestorName', 'title', 'vendorName', 'vatId', 'department', 'totalCost'];
    for (const field of requiredFields) {
      if (!form[field]) {
        alert(`Please fill in ${field}`);
        return false;
      }
    }
  
    if (!form.orderLines.length) {
      alert("At least one order line is required.");
      return false;
    }
  
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
  
    try {
      await axios.post('http://localhost:3000/api/requests', form);
      alert('Request submitted successfully!');
  
      // Reset form after submit
      setForm({
        requestorName: '',
        title: '',
        vendorName: '',
        vatId: '',
        department: '',
        totalCost: '',
        orderLines: [],
      });
    } catch (err) {
      console.error('Submission failed:', err);
      alert('Submission failed');
    }
  };
  
  {previewData && (
    <div style={{ backgroundColor: '#f6f6f6', padding: '1rem', marginBottom: '1rem' }}>
      <h4>🧾 Parsed Data Preview</h4>
      <pre style={{ fontSize: '0.9rem', overflowX: 'auto' }}>
        {JSON.stringify(previewData, null, 2)}
      </pre>
      <button
        type="button"
        onClick={() => {
          setForm((prev) => ({
            ...prev,
            vendorName: previewData.vendorName || '',
            vatId: previewData.vatId || '',
            department: previewData.department || '',
            totalCost: previewData.totalCost || '',
            orderLines: previewData.orderLines || [],
          }));
          alert('Form filled from preview!');
          setPreviewData(null);
        }}
      >
        ✅ Use This Data
      </button>
      <button
        type="button"
        onClick={() => setPreviewData(null)}
        style={{ marginLeft: '1rem' }}
      >
        ❌ Discard
      </button>
    </div>
  )}
  

  return (
    <form onSubmit={handleSubmit}>
      <h3>General Info</h3>
      <input name="requestorName" value={form.requestorName} onChange={handleChange} placeholder="Requestor Name" required />
      <input name="title" value={form.title} onChange={handleChange} placeholder="Short Description" required />
      <input name="vendorName" value={form.vendorName} onChange={handleChange} placeholder="Vendor Name" required />
      <input name="vatId" value={form.vatId} onChange={handleChange} placeholder="VAT ID" required />
      <input name="department" value={form.department} onChange={handleChange} placeholder="Department" required />
      <input name="totalCost" value={form.totalCost} onChange={handleChange} type="number" placeholder="Total Cost" required />

      <div style={{ marginTop: '1rem' }}>
        <label>Upload Vendor Offer (PDF):</label>
        <input type="file" accept=".pdf" onChange={handleFileUpload} />
      </div>

      <h3>Order Lines</h3>
      {form.orderLines.map((line, index) => (
        <div key={index}>
          <input
            placeholder="Description"
            value={line.description}
            onChange={(e) => handleOrderLineChange(index, 'description', e.target.value)}
          />
          <input
            placeholder="Unit Price"
            type="number"
            value={line.unitPrice}
            onChange={(e) => handleOrderLineChange(index, 'unitPrice', e.target.value)}
          />
          <input
            placeholder="Amount"
            type="number"
            value={line.amount}
            onChange={(e) => handleOrderLineChange(index, 'amount', e.target.value)}
          />
          <input
            placeholder="Unit"
            value={line.unit}
            onChange={(e) => handleOrderLineChange(index, 'unit', e.target.value)}
          />
          <input
            placeholder="Total Price"
            type="number"
            value={line.totalPrice}
            onChange={(e) => handleOrderLineChange(index, 'totalPrice', e.target.value)}
          />
          <button type="button" onClick={() => removeOrderLine(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={addOrderLine}>+ Add Line</button>

      <div style={{ marginTop: '1rem' }}>
        <button type="submit">Submit</button>
        <button type="button" onClick={() => navigate('/overview')} style={{ marginLeft: '1rem' }}>
            Go to Overview →
        </button>
      </div>
    </form>
  );
};

export default RequestForm;
