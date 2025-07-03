const RequestModal = ({ request, onClose }) => {
    if (!request) return null;
  
    return (
      <div className="modal-bg">
        <div className="modal-box">
          <h3>{request.title}</h3>
          <p><strong>Vendor:</strong> {request.vendorName}</p>
          <p><strong>Department:</strong> {request.department}</p>
          <p><strong>Status:</strong> {request.status}</p>
          <p><strong>Total Cost:</strong> €{request.totalCost}</p>
  
          <h4>Order Lines</h4>
          <ul>
            {request.orderLines.map((line, i) => (
              <li key={i}>
                {line.amount} × {line.description} (€{line.unitPrice}) = €{line.totalPrice}
              </li>
            ))}
          </ul>
  
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };
  
  export default RequestModal;
  