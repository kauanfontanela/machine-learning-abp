import joblib
import pickle
import pandas as pd
from fastapi import FastAPI
from datetime import datetime

linear_regression = joblib.load("models/linear_regression.pkl")
app = FastAPI()

with open("encoders/uf.pickle", 'rb') as file:
    uf_encoder = pickle.load(file)


@app.get("/linear-regression")
def predict(date: str, uf: str):
    # X = pd.DataFrame({
    #     "DOF_NOTIFIC": pd.to_datetime(date, format="%d/%m/%Y").dayofyear,
    #     "UF": str
    # })
    date = pd.to_datetime(date, format="%d/%m/%Y").dayofyear
    uf = uf_encoder.transform([uf])[0]
    X = [[date, uf]]

    Y = linear_regression.predict(X)[0]

    return str(Y)
