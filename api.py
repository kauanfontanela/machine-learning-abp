import joblib
import json
import pickle
import pandas as pd
from fastapi import FastAPI
from datetime import datetime

linear_regression = joblib.load("linear_regression.pkl")
decision_tree = joblib.load("decision-tree.pkl")
random_forest = joblib.load("random-forest.pkl")


app = FastAPI()

with open("uf.pickle", 'rb') as file:
    uf_encoder = pickle.load(file)


@app.get("/predict")
def predict(date: str, uf: str, model: str = "linear_regression"):
    date = pd.to_datetime(date, format="%d/%m/%Y").dayofyear
    uf = uf_encoder.transform([uf])[0]

    X = [[date, uf]]

    pred = []
    for model in [linear_regression, decision_tree, random_forest]:
        pred.append(model.predict(X)[0])

    return json.dumps(pred)
