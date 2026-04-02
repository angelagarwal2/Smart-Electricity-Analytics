import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np

# 1. Create some dummy historical electricity data (Units consumed per month)
data = {
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    'units_consumed': [200, 210, 195, 205, 220, 850, 215, 230, 900, 205] # Spikes in Jun and Sep
}
df = pd.DataFrame(data)

# 2. Initialize the Isolation Forest Model
# contamination=0.2 means we expect about 20% of the data to be anomalies
model = IsolationForest(contamination=0.2, random_state=42)

# 3. Train the model on the units consumed
X = df[['units_consumed']]
model.fit(X)

# 4. Predict anomalies (-1 means anomaly, 1 means normal)
df['anomaly'] = model.predict(X)

print(df)