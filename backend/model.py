import pandas as pd
from sklearn.ensemble import IsolationForest
import numpy as np


data={
    'month': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    'units_consumed': [200, 210, 195, 205, 220, 850, 215, 230, 900, 205] #Spikes in Jun and Sep
}
df=pd.DataFrame(data)

model=IsolationForest(contamination=0.2, random_state=42)

X=df[['units_consumed']]
model.fit(X)

df['anomaly']=model.predict(X)

print(df)