@echo off
title iFurnish Shop - AI Recommendation Service
echo ========================================================
echo Starting iFurnish AI Recommendation Engine (Port 5001)...
echo ========================================================

start "Flask AI Engine" cmd /k "cd /d "%~dp0furniture recommendation" && .\venv\Scripts\python.exe app.py"

timeout /t 4 /nobreak >nul

echo ========================================================
echo Starting Secure Cloudflare Tunnel...
echo (Copy the https://....trycloudflare.com URL below)
echo ========================================================
if exist "C:\Program Files (x86)\cloudflared\cloudflared.exe" (
    "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://localhost:5001
) else if exist "C:\Program Files\cloudflared\cloudflared.exe" (
    "C:\Program Files\cloudflared\cloudflared.exe" tunnel --url http://localhost:5001
) else (
    npx --yes localtunnel --port 5001
)
pause
