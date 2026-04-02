import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const colors = { bg: '#F7F9FB', text: '#1E1E1E' };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('https://smart-electricity-analytics.onrender.com/analyze-csv', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Failed to analyze data");
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: '100vh', padding: '40px', fontFamily: 'system-ui, sans-serif', color: colors.text }}>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Conditional Rendering: Show Landing Page if no data, else show Dashboard */}
      {!data ? (
        <LandingPage handleFileUpload={handleFileUpload} loading={loading} />
      ) : (
        <Dashboard data={data} onUpload={handleFileUpload} loading={loading} onReset={() => setData(null)} />
      )}
      
    </div>
  );
}

export default App;