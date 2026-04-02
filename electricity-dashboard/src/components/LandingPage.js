import React from 'react';
import { UploadCloud, Zap, ShieldAlert, BarChart3 } from 'lucide-react';

export default function LandingPage({ handleFileUpload, loading }) {
  const colors = { primary: '#2F5D62', secondary: '#A7C7C7', bg: '#F7F9FB', text: '#1E1E1E' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <div style={{ backgroundColor: colors.secondary, padding: '15px', borderRadius: '50%', marginBottom: '20px' }}>
        <Zap size={40} color={colors.primary} />
      </div>
      
      <h1 style={{ color: colors.primary, fontSize: '42px', marginBottom: '10px' }}>Smart Electricity Analytics</h1>
      <p style={{ color: '#555', fontSize: '18px', maxWidth: '600px', marginBottom: '40px' }}>
        An AI-driven diagnostic tool to detect electricity overbilling, identify faulty appliances, and forecast future consumption using robust statistical modeling.
      </p>

      <div style={{ display: 'flex', gap: '30px', marginBottom: '50px' }}>
        <FeatureCard icon={<BarChart3 size={24} color={colors.primary} />} title="1. Upload Data" desc="Provide historical monthly billing data via CSV." />
        <FeatureCard icon={<ShieldAlert size={24} color="#F2A365" />} title="2. Detect Spikes" desc="Z-Score algorithms flag abnormal usage instantly." />
        <FeatureCard icon={<Zap size={24} color={colors.primary} />} title="3. Get Insights" desc="Receive appliance diagnostics and predicted savings." />
      </div>

      <label style={{
        backgroundColor: colors.primary, color: 'white', padding: '16px 32px', fontSize: '18px',
        borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
        fontWeight: 'bold', transition: '0.3s', boxShadow: '0 4px 15px rgba(47, 93, 98, 0.3)'
      }}>
        <UploadCloud size={24} />
        {loading ? "Processing Algorithm..." : "Upload CSV to Begin"}
        <input type="file" accept=".csv" onChange={handleFileUpload} style={{ display: 'none' }} />
      </label>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', width: '200px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '10px' }}>{icon}</div>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1E1E1E' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{desc}</p>
    </div>
  );
}