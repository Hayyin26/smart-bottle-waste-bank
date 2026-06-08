# 🔄 Script untuk Restart Web App dan Clear Cache

Write-Host "🔄 Restarting Web App..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop all Node.js processes
Write-Host "1️⃣ Stopping Node.js processes..." -ForegroundColor Yellow
try {
    Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "   ✅ Node.js processes stopped" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️ No Node.js processes found" -ForegroundColor Yellow
}
Write-Host ""

# Step 2: Clear Next.js cache
Write-Host "2️⃣ Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "   ✅ .next folder deleted" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ .next folder not found" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Clear node_modules cache (optional)
Write-Host "3️⃣ Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache
    Write-Host "   ✅ node_modules/.cache deleted" -ForegroundColor Green
} else {
    Write-Host "   ⚠️ node_modules/.cache not found" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Start web app
Write-Host "4️⃣ Starting web app..." -ForegroundColor Yellow
Write-Host "   Running: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️ IMPORTANT:" -ForegroundColor Red
Write-Host "   After web app starts, open browser in Incognito mode" -ForegroundColor Yellow
Write-Host "   and press Ctrl+Shift+R to hard refresh!" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Access at:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000/iot-auth?device=ESP32-BOTOL-01" -ForegroundColor White
Write-Host "   http://10.139.60.155:3000/iot-auth?device=ESP32-BOTOL-01" -ForegroundColor White
Write-Host ""

# Start npm run dev
npm run dev
