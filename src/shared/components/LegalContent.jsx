import React from 'react';
import { useTerms } from '../../hooks/useSite';
import { Spinner } from 'react-bootstrap';

const LegalContent = ({ title, type }) => {
  const { data, isLoading, isError } = useTerms();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">Failed to load content</h3>
        <p>Please try again later.</p>
      </div>
    );
  }

  // Assuming data structure based on typical API responses
  // Usually it's an array or object containing HTML content
  const content = data?.data?.[0]?.content || 'Content is being updated...';

  return (
    <div className="bg-white py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-8">
            <h1 className="fw-bold mb-5 text-center" style={{ color: 'var(--color-primary)' }}>{title}</h1>
            
            <div 
              className="prose-content"
              style={{ 
                lineHeight: '1.8', 
                color: 'var(--color-text-dark)',
                fontSize: 'var(--font-size-base)'
              }}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalContent;
