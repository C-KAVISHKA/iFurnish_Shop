@echo off
title iFurnish Shop - AI Recommendation Service
echo ========================================================
echo Starting iFurnish AI Recommendation Service (Port 5001)...
echo ========================================================

start "Flask AI Engine" cmd /k "cd /d "%~dp0furniture recommendation" && .\venv\Scripts\python.exe app.py"

timeout /t 3 /nobreak >nul

echo ========================================================
echo Connecting to Permanent Tunnel: https://ifurnish-recommendation-api.loca.lt
echo ========================================================
npx --yes localtunnel --port 5001 --subdomain ifurnish-recommendation-api
pause
