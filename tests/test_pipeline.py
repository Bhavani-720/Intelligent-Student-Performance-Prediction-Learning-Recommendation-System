import pytest
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score

@pytest.fixture
def dataset():
    return pd.read_csv('public/data/student_performance_benchmark.csv')

def test_dataset_schema(dataset):
    expected_cols = {'studentId', 'studyTimeWeeklyHours', 'attendanceRate', 'midterm1Score', 'midterm2Score', 'finalExamScore'}
    assert expected_cols.issubset(set(dataset.columns)), 'Missing mandatory academic features'

def test_numerical_bounds(dataset):
    assert (dataset['attendanceRate'] >= 0).all() and (dataset['attendanceRate'] <= 100).all()
    assert (dataset['finalExamScore'] >= 0).all() and (dataset['finalExamScore'] <= 100).all()
    assert (dataset['studyTimeWeeklyHours'] >= 0).all()

def test_missing_values(dataset):
    assert dataset.isna().sum().sum() == 0, 'Clean benchmark dataset should contain 0 missing values'

def test_model_training_and_r2_superiority(dataset):
    features = ['studyTimeWeeklyHours', 'attendanceRate', 'absences', 'pastFailures', 'midterm1Score', 'midterm2Score']
    X = dataset[features]
    y = dataset['finalExamScore']
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    rf = RandomForestRegressor(n_estimators=50, max_depth=5, random_state=42)
    rf.fit(X_scaled, y)
    preds = rf.predict(X_scaled)
    
    r2 = r2_score(y, preds)
    mae = mean_absolute_error(y, preds)
    assert r2 > 0.80, f'Random Forest R2 must exceed 0.80, got {r2}'
    assert mae < 5.0, f'Random Forest MAE must be under 5.0 pts, got {mae}'

def test_evaluation_metric_properties(dataset):
    y = dataset['finalExamScore']
    y_pred = dataset['midterm2Score']  # proxy
    mae = mean_absolute_error(y, y_pred)
    rmse = np.sqrt(np.mean((y - y_pred)**2))
    assert mae >= 0
    assert rmse >= mae, 'RMSE must be greater than or equal to MAE'