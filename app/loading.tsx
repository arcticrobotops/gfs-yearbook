export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFF8EE',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            color: '#C9A84C',
            fontSize: '24px',
            animation: 'spin 2s ease-in-out infinite',
          }}
        >
          &#9733;
        </div>
        <p
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#333333',
            marginTop: '16px',
          }}
        >
          Loading yearbook...
        </p>
        <style dangerouslySetInnerHTML={{ __html: '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }' }} />
      </div>
    </div>
  );
}
