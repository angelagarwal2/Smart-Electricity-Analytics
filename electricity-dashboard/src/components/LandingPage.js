import React, { useRef } from 'react';
import { Zap, UploadCloud, ShieldAlert, LineChart } from 'lucide-react';

export default function LandingPage({ handleFileUpload, loading }) {
  const fileInputRef = useRef(null);
  const colors = { primary: '#2F5D62', secondary: '#A7C7C7', accent: '#F2A365', text: '#1E1E1E', bg: '#F7F9FB' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center', padding: '20px' }}>
      
      {/* --- INJECTED RESPONSIVE CSS --- */}
      <style>{`
        .features-container {
          display: flex;
          gap: 20px;
          margin: 40px 0;
          justify-content: center;
          width: 100%;
          max-width: 900px;
        }
        .feature-card {
          background: white;
          padding: 25px 20px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          flex: 1;
          min-width: 200px;
        }
        
        /* Stack cards vertically on mobile phones */
        @media (max-width: 768px) {
          .features-container {
            flex-direction: column;
            align-items: center;
          }
          .feature-card {
            width: 100%;
            max-width: 320px; /* Keeps them from stretching too wide on mobile */
          }
        }
      `}</style>

      {/* Main Content */}
      <div style={{ backgroundColor: '#D4E2E2', padding: '20px', borderRadius: '50%', marginBottom: '20px' }}>
        <Zap size={40} color={colors.primary} />
      </div>
      
      <h1 style={{ color: colors.primary, fontSize: '2.5rem', margin: '0 0 15px 0', maxWidth: '600px', lineHeight: '1.2' }}>
        Smart Electricity Analytics
      </h1>
      
      <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '500px', margin: '0 0 30px 0', lineHeight: '1.5' }}>
        An AI-driven diagnostic tool to detect electricity overbilling, identify faulty appliances, and forecast future consumption using robust statistical modeling.
      </p>

      {/* Feature Cards Container */}
      <div className="features-container">
        <div className="feature-card">
          <UploadCloud size={28} color={colors.primary} style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: colors.text }}>1. Upload Billing</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Provide your historical monthly CSV consumption data.</p>
        </div>
        <div className="feature-card">
          <ShieldAlert size={28} color={colors.accent} style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: colors.text }}>2. Detect Spikes</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Z-Score algorithms flag abnormal usage instantly.</p>
        </div>
        <div className="feature-card">
          <LineChart size={28} color={colors.primary} style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: colors.text }}>3. Get Insights</h3>
          <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>Receive actionable PDF reports and savings estimates.</p>
        </div>
      </div>

      {/* Upload Button */}
      <button 
        onClick={() => fileInputRef.current && fileInputRef.current.click()} 
        disabled={loading}
        style={{ 
          display: 'flex', alignItems: 'center', gap: '10px', padding: '15px 30px', 
          borderRadius: '8px', border: 'none', backgroundColor: colors.primary, 
          color: 'white', fontSize: '1.1rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 15px rgba(47, 93, 98, 0.3)', transition: '0.2s', opacity: loading ? 0.7 : 1
        }}
      >
        <UploadCloud size={20} />
        {loading ? "Analyzing Data..." : "Upload CSV to Begin"}
      </button>
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        accept=".csv" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        style={{ display: 'none' }} 
      />
    </div>
  );
}