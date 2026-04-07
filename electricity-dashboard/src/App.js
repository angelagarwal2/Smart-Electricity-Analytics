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
      // PROD URL: Ensure this perfectly matches your Render URL with /analyze-csv at the end
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
      
      {/* Global Error Banner */}
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <strong>System Error:</strong> {error}
        </div>
      )}

      {/* Conditional Rendering Logic */}
      {!data ? (
        <LandingPage handleFileUpload={handleFileUpload} loading={loading} />
      ) : (
        <Dashboard data={data} onUpload={handleFileUpload} loading={loading} onReset={() => setData(null)} />
      )}
      
    </div>
  );
}

export default App;