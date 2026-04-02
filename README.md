# ⚡ Smart Electricity Analytics Framework 

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Deployed](https://img.shields.io/badge/Deployed-Success-brightgreen?style=for-the-badge)

A data-driven electricity analytics system that detects abnormal consumption patterns, identifies potential overbilling, and generates actionable insights using robust statistical modeling.

**Live Demo:** [[Vercel](https://smart-electricity-analytics.vercel.app/)]  
**API Endpoint:** [[Render](https://smart-electricity-analytics.onrender.com)]

---

## The Problem
Current electricity billing systems rely on static monthly readings, creating massive gaps for consumers:
* **Billing Blind Spots:** Sudden consumption spikes go unnoticed until the bill is generated, causing financial shock.
* **Delayed Fault Detection:** Faulty meters or malfunctioning heavy appliances are identified only after prolonged usage.
* **No Preventive Insights:** Consumers lack visibility into consumption trends and cannot take corrective action in advance.

## The Solution
This framework transforms raw billing data into actionable insights using robust statistical modeling, completely offline/locally before generating a premium, corporate-grade PDF report.

### Key Features
* **Interactive Analytics Dashboard:** Real-time visual trends highlighting exactly when and where overbilling occurred.
* **Financial Forecasting:** Dynamic calculation of "Expected Bills" using a 3-month rolling average, alongside predictions for the next billing cycle.
* **Automated Diagnostics:** Intelligent, data-driven recommendations based on the severity of the anomaly (e.g., suggesting a meter audit for a 300%+ spike vs. an AC check for a 50% spike).
* **Corporate Report Generation:** One-click export of a clean, formatted PDF document containing executive summaries, KPI tables, and isolated charts.

---

## Methodology: Modified Z-Score Anomaly Detection
Standard Z-scores fail on highly volatile datasets because massive outliers skew the Mean and Standard Deviation. This system implements a **Modified Z-Score algorithm** utilizing the **Median** and **Median Absolute Deviation (MAD)**.

1. Uses Median instead of Mean.
2. The absolute deviation of every data point from the median is calculated (MAD).
3. A threshold of `3.5 standard deviations` is applied. Any billing month crossing this threshold is mathematically flagged as an anomaly, guaranteeing robustness against extreme outliers.

---

## Tech Stack

**Frontend (Client)**
* **React.js:** UI component architecture.
* **Recharts:** High-performance, declarative data visualization.
* **jsPDF & html2canvas:** Programmatic, professional PDF generation.
* **Lucide React:** Modern iconography.
* **Deployment:** Vercel

**Backend (API)**
* **Python 3.11:** Core execution environment.
* **FastAPI:** High-performance, modern async web framework.
* **Pandas & NumPy:** Vectorized mathematical operations and dataset manipulation.
* **Deployment:** Render (Cloud Native)

---

## Sample Data Format
To test the system, upload a .csv file with exactly two columns: Month and Units.

```
Month,Units
Jan,200
Feb,210
Mar,195
Apr,850
May,215
Jun,900
Jul,205
