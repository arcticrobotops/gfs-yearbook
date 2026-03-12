'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('[GFS Yearbook] Error boundary caught:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF8EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
        <div style={{ color: '#C9A84C', fontSize: '24px', marginBottom: '12px' }}>&#9733;</div>
        <h2
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: '1.5rem',
            marginBottom: '16px',
            color: '#333333',
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.875rem',
            color: '#666666',
            marginBottom: '32px',
            lineHeight: '1.6',
          }}
        >
          We hit a snag loading the yearbook. This usually resolves on retry.
        </p>
        <button
          onClick={() => reset()}
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            padding: '12px 24px',
            border: '1px solid #333333',
            backgroundColor: 'transparent',
            color: '#333333',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
