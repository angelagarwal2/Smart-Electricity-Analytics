import React from 'react';
import { TrendingUp, AlertTriangle, IndianRupee, CalendarClock } from 'lucide-react';

const KPICard = ({ title, value, icon, color }) => (
  <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', borderLeft: `5px solid ${color}`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', marginBottom: '8px', fontSize: '14px' }}>
      {icon} <span>{title}</span>
    </div>
    <h2 style={{ margin: 0, fontSize: '22px', color: '#1E1E1E' }}>{value}</h2>
  </div>
);

export default function KPICards({ data, colors }) {
  return (
    <div className="kpi-grid">
      <KPICard title="Avg. Monthly Usage" value={`${data.insights.average_monthly_units} kWh`} icon={<TrendingUp size={20} />} color={colors.secondary} />
      <KPICard title="Anomalies Found" value={data.insights.anomalies_detected} icon={<AlertTriangle size={20} />} color={data.insights.anomalies_detected > 0 ? colors.accent : colors.secondary} />
      <KPICard title="Potential Savings" value={`₹${data.insights.potential_savings}`} icon={<IndianRupee size={20} />} color={colors.primary} />
      <KPICard title="Est. Next Bill" value={`₹${data.insights.next_month_prediction}`} icon={<CalendarClock size={20} />} color="#4a4a4a" />
    </div>
  );
}