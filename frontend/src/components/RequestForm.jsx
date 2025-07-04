import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Upload, Loader2 } from 'lucide-react';
import axios from 'axios';
import { parsePdf, createRequest } from '../services/requestService';

const initialState = {
    requestorName: '',
    title: '',
    vendorName: '',
    vatId: '',
    department: '',
    totalCost: '',
    orderLines: [],
  };

const RequestForm = () => {
  const navigate = useNavigate();

  const [isParsing, setParsing] = useState(false);

  const [previewData, setPreviewData] = useState(null);

  const [form, setForm] = useState(initialState);

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
  
    setParsing(true);

    try {
      const data = await parsePdf(file);
      console.log('Extracted →', data);
  
      setForm((prev) => ({
        ...prev,
        vendorName : data.vendorName || prev.vendorName,
        vatId      : data.vatId      || prev.vatId,
        department : data.department || prev.department,
        totalCost  : data.totalCost !== undefined ? String(data.totalCost) : prev.totalCost,
      
        orderLines : data.orderLines.length
          ? data.orderLines.map((l) => ({
              description:  l.description,
              amount:       String(l.amount),
              unitPrice:    String(l.unitPrice),
              totalPrice:   String(l.totalPrice),
              commodityGroupId:   l.commodityGroupId,
              commodityGroupName: l.commodityGroupName,
              unit: l.unit || 'pcs',
            }))
          : prev.orderLines,
      }));

      toast.success('Auto-filled from PDF!', { icon: <Upload size={16}/> });
    } catch (err) {
      console.error('PDF parse failed', err);
      toast.error('Could not extract info 👎');
    } finally {
        setParsing(false);
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

    /* 0) basic client-side check */
    if (!form.orderLines.length) {
        toast.error('Add at least one order line');    // optional toast
        return;
    }

    /* 1) convert string → number */
    const payload = {
        ...form,
        totalCost: Number(form.totalCost) || 0,
        orderLines: form.orderLines.map((l) => ({
        ...l,
        amount:      Number(l.amount)      || 0,
        unitPrice:   Number(l.unitPrice)   || 0,
        totalPrice:  Number(l.totalPrice)  || 0,
        })),
    };

    try {
        await createRequest(payload);
        toast.success('Request saved!');
        /* 2) reset */
        setForm(initialState);
    } catch (err) {
        console.error('Submission failed →', err?.response?.data || err);
        toast.error('Server rejected payload (check required fields).');
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
    <motion.form
      initial={{opacity:0, y:20}}
      animate={{opacity:1, y:0}}
      transition={{duration:.4}}
      onSubmit={handleSubmit}
    >
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
        <button type="submit" disabled={isParsing}>Submit</button>
        <button type="button" onClick={() => navigate('/overview')} style={{ marginLeft: '1rem' }}>
            Go to Overview →
        </button>
      </div>

      {isParsing && (
        <div style={{
            position:'absolute', inset:0, backdropFilter:'blur(2px)',
            display:'flex', alignItems:'center', justifyContent:'center'
        }}>
            <Loader2 size={48} className="spin" />
        </div>
      )}

    </motion.form>
  );
};

export default RequestForm;
