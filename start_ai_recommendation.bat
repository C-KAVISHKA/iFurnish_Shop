@echo off
title iFurnish Shop - AI Recommendation Engine
echo ========================================================
echo Starting iFurnish AI Recommendation Engine (Port 5001)...
echo ========================================================

start "Flask AI Engine" cmd /k "cd /d "%~dp0furniture recommendation" && .\venv\Scripts\python.exe app.py"

timeout /t 4 /nobreak >nul

echo ========================================================
echo Connecting to Permanent Domain: https://skincare-resend-emcee.ngrok-free.dev
echo ========================================================
node "%~dp0tunnel.js"
pause
