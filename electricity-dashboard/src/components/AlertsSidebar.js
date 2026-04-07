import React from 'react';
import { AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

export default function AlertsSidebar({ data, colors }) {
  const anomalies = data.data.filter(d => d.is_anomaly);

  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxHeight: '400px', overflowY: 'auto' }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: colors.text }}>Diagnostic Alerts</h3>
      {anomalies.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'green', padding: '10px', backgroundColor: '#eaffea', borderRadius: '8px' }}>
          <CheckCircle size={18} /> No overbilling detected.
        </div>
      ) : (
        anomalies.map((item, index) => (
          <div key={index} style={{ borderLeft: `4px solid ${colors.red}`, backgroundColor: '#fff8f8', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: colors.red, fontWeight: 'bold', marginBottom: '10px' }}>
              <AlertTriangle size={18} /> Alert: {item.month}
            </div>
            <div style={{ fontSize: '13px', color: '#444', display: 'flex', justifyContent: 'space-between', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #fee2e2' }}>
              <span>Actual: <strong>₹{item.actual_bill}</strong></span>
              <span>Expected: ₹{item.expected_bill}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#555', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <Lightbulb size={14} color={colors.accent} style={{ flexShrink: 0, marginTop: '2px' }} />
              <i>{item.suggestion}</i>
            </div>
          </div>
        ))
      )}
    </div>
  );
}