import React from 'react';
import RequestForm from '../components/RequestForm';

const SubmitRequest = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Submit Procurement Request</h1>
      <RequestForm />
    </div>
  );
};

export default SubmitRequest;
