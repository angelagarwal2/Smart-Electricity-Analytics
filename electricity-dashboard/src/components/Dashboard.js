import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Download, UploadCloud, Home } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

// Import our sub-components and the global CSS
import KPICards from './KPICards';
import AlertsSidebar from './AlertsSidebar';
import '../App.css'; 

export default function Dashboard({ data, onUpload, loading, onReset }) {
  const colors = { primary: '#2F5D62', secondary: '#A7C7C7', accent: '#F2A365', text: '#1E1E1E', bg: '#F7F9FB', red: '#e63946' };

  const generateProfessionalReport = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // 1. Title Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(47, 93, 98); 
    doc.text("Smart Electricity Analytics", 14, 22);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Confidential User Data Analysis | Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 34, pageWidth - 14, 34); 

    // 2. Executive Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", 14, 46);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    if (data.insights.anomalies_detected > 0) {
      doc.setTextColor(230, 57, 70); 
      doc.text(`ATTENTION: ${data.insights.anomalies_detected} anomalies detected with a potential overbilling of Rs. ${data.insights.potential_savings}.`, 14, 54);
      doc.text("Immediate inspection of hardware and billing statements is recommended.", 14, 60);
    } else {
      doc.setTextColor(34, 139, 34); 
      doc.text("All consumption metrics are within normal statistical deviations. No overbilling detected.", 14, 54);
    }

    // 3. Key Metrics
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Key Performance Metrics", 14, 76);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`• Average Monthly Usage: ${data.insights.average_monthly_units} kWh`, 14, 84);
    doc.text(`• Anomalies Detected: ${data.insights.anomalies_detected} Spikes`, 14, 91);
    doc.text(`• Estimated Next Bill: Rs. ${data.insights.next_month_prediction}`, pageWidth / 2, 84);
    doc.text(`• Potential Savings: Rs. ${data.insights.potential_savings}`, pageWidth / 2, 91);

    // 4. Chart Snapshot (Using Ghost Canvas)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Historical Consumption Trends", 14, 108);
    
    const chartElement = document.getElementById('print-chart-container');
    const canvas = await html2canvas(chartElement, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 12, 114, 185, 60);

    // 5. Corporate Anomaly Table
    const tableData = data.data.filter(d => d.is_anomaly).map(item => {
      const deviation = (((item.actual_bill - item.expected_bill) / item.expected_bill) * 100).toFixed(0);
      return [item.month, `Rs. ${item.actual_bill}`, `Rs. ${item.expected_bill}`, `+${deviation}%`, "Overbilling Alert"];
    });

    if (tableData.length > 0) {
      autoTable(doc, {
        startY: 180,
        head: [['Month', 'Actual Bill', 'Expected Bill', 'Deviation', 'Status']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [234, 243, 242], textColor: [30, 30, 30], fontStyle: 'bold' }, 
        styles: { cellPadding: 5, fontSize: 10 },
        columnStyles: { 4: { textColor: [230, 57, 70], fontStyle: 'bold' } }
      });
    }

    let currentY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 185;

    // 6. Methodology
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Methodology & Analysis", 14, currentY);
    currentY += 8;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text("Anomalies were mathematically detected using Modified Z-score analysis. Consumption values exceeding", 14, currentY);
    currentY += 5;
    doc.text("3.5 standard deviations from the median were flagged as abnormal, ensuring robustness against extreme outliers.", 14, currentY);
    currentY += 14;

    // 7. Data-Driven Recommendations
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Targeted Recommendations", 14, currentY);
    currentY += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    
    if (data.insights.anomalies_detected === 0) {
      doc.text("Continue standard usage. No hardware diagnostics required at this time.", 14, currentY);
    } else {
      data.data.forEach(item => {
        if (item.is_anomaly) {
          const dev = (((item.actual_bill - item.expected_bill) / item.expected_bill) * 100).toFixed(0);
          if (dev > 200) {
             doc.text(`• ${item.month} shows a massive +${dev}% spike. Highly indicative of an abnormal event or severe meter fault.`, 14, currentY);
          } else {
             doc.text(`• ${item.month} shows sustained high usage (+${dev}%). Recommend auditing daily high-power appliance usage.`, 14, currentY);
          }
          currentY += 7;
        }
      });
    }

    // 8. Professional Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by the Smart Electricity Analytics System", 14, pageHeight - 10);
    doc.text("Page 1 of 1", pageWidth - 25, pageHeight - 10);

    doc.save("Smart_Electricity_Analytics_Report.pdf");
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pointData = payload[0].payload;
      return (
        <div style={{ backgroundColor: 'white', padding: '15px', border: `1px solid ${colors.secondary}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: colors.text }}>{label} Usage</p>
          <p style={{ margin: 0, color: colors.primary }}>Consumption: <strong>{pointData.units} kWh</strong></p>
          {pointData.is_anomaly && (
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee', color: colors.red, fontSize: '13px', fontWeight: 'bold' }}>
              ⚠️ {pointData.z_score}σ above normal.
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', animation: 'fadeIn 0.5s ease-in' }}>
      
      {/* --- DASHBOARD UI HEADER --- */}
      <div className="dashboard-header">
        <h2 style={{ color: colors.primary, margin: 0 }}>Analytics Dashboard</h2>
        
        <div className="header-actions">
          <button onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px', border: `1px solid #ddd`, backgroundColor: '#fff', color: '#555', cursor: 'pointer', fontWeight: 'bold' }}>
            <Home size={18} /> Home
          </button>
          <button onClick={generateProfessionalReport} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px', border: `1px solid ${colors.primary}`, backgroundColor: 'white', color: colors.primary, cursor: 'pointer', fontWeight: 'bold' }}>
            <Download size={18} /> Export Pro Report
          </button>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '6px', border: 'none', backgroundColor: colors.primary, color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>
            <UploadCloud size={18} />
            {loading ? "Updating..." : "Upload New CSV"}
            <input type="file" accept=".csv" onChange={onUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {/* --- SUBCOMPONENTS --- */}
      <KPICards data={data} colors={colors} />

      <div className="main-content-grid">
        
        {/* Interactive UI Chart */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', minHeight: '400px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px', color: colors.text }}>Historical Consumption Trends</h3>
          
          {/* ADDED STRICT MIN-WIDTH/HEIGHT TO SILENCE THE RECHARTS WARNING */}
          <div style={{ height: '320px', width: '100%', minHeight: '320px', minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="units" radius={[4, 4, 0, 0]}>
                  {data.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.is_anomaly ? colors.accent : colors.primary} />
                  ))}
                </Bar>
                <Line type="monotone" dataKey="anomaly_marker" stroke="none" dot={{ r: 6, fill: colors.red, stroke: 'white', strokeWidth: 2 }} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* UI Alerts Component */}
        <AlertsSidebar data={data} colors={colors} />
      </div>

      {/* --- THE GHOST CANVAS (Hidden Document Chart for PDF generation) --- */}
      {/* NO ResponsiveContainer used here to prevent render bugs during PDF capture */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div id="print-chart-container" style={{ width: '850px', height: '350px', backgroundColor: '#ffffff', padding: '10px' }}>
          <ComposedChart width={830} height={330} data={data.data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 13}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 13}} />
            <Bar dataKey="units" barSize={35} radius={[2, 2, 0, 0]}>
              {data.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.is_anomaly ? '#D96A45' : '#7A9B9E'} />
              ))}
            </Bar>
          </ComposedChart>
        </div>
      </div>

    </div>
  );
}