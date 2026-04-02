from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

PRICE_PER_UNIT = 8.0 

@app.post("/analyze-csv")
async def analyze_csv(file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        df.columns = [col.strip().lower() for col in df.columns]
        
        if 'month' not in df.columns or 'units' not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'Month' and 'Units' columns.")
        
        units_array = df['units'].values
        median_units = np.median(units_array)
        mad = np.median(np.abs(units_array - median_units))
        if mad == 0: mad = 1.0 
            
        THRESHOLD = 3.5 
        
        # Calculate Rolling Mean for "Expected Bill" (Dynamic Baseline)
        # Shift(1) means we look at the average of the PREVIOUS months, not including the current spike
        df['rolling_mean'] = df['units'].shift(1).rolling(window=3, min_periods=1).mean()
        df['rolling_mean'] = df['rolling_mean'].fillna(median_units) # Fallback for month 1

        results = []
        total_savings_opportunity = 0
        anomalies_count = 0
        
        for index, row in df.iterrows():
            unit = float(row['units'])
            month = str(row['month'])
            expected_units = float(row['rolling_mean'])
            
            mod_z_score = (0.6745 * (unit - median_units)) / mad
            is_anomaly = bool(mod_z_score > THRESHOLD)
            
            actual_bill = unit * PRICE_PER_UNIT
            expected_bill = expected_units * PRICE_PER_UNIT
            
            # Generate Smart Suggestions based on severity
            suggestion = "Usage looks optimal."
            if is_anomaly:
                anomalies_count += 1
                wasted_money = actual_bill - expected_bill
                if wasted_money > 0:
                    total_savings_opportunity += wasted_money
                
                if mod_z_score > 6.0:
                    suggestion = "Massive spike. Check for a faulty meter or a major appliance short-circuit."
                else:
                    suggestion = "High usage detected. Verify AC/Heater usage or check for continuous background drain (e.g., faulty geyser)."
            
            results.append({
                "month": month.capitalize(),
                "units": unit,
                "z_score": round(mod_z_score, 2),
                "is_anomaly": is_anomaly,
                "actual_bill": round(actual_bill, 2),
                "expected_bill": round(expected_bill, 2),
                "suggestion": suggestion,
                "anomaly_marker": unit if is_anomaly else None # Used for the red dot on the graph
            })
            
        # Predict Next Month's Bill (Average of last 3 months)
        next_month_prediction = round(df['units'].tail(3).mean() * PRICE_PER_UNIT, 2)
            
        return {
            "insights": {
                "average_monthly_units": round(np.mean(units_array), 2),
                "anomalies_detected": anomalies_count,
                "potential_savings": round(total_savings_opportunity, 2),
                "next_month_prediction": next_month_prediction,
                "trend_summary": "High volatility detected. Check suggestions for hardware diagnostics." if anomalies_count > 0 else "Consumption is stable."
            },
            "data": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))