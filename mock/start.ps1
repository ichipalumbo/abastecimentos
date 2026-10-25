# Script para rodar Abastecimentos (mock + servidor web)
# Clique duplo ou rode: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host "🚀 Iniciando Abastecimentos..." -ForegroundColor Green
Write-Host ""

# Verifica se está na pasta correta (mock)
if (-Not (Test-Path "server.js")) {
    Write-Host "❌ Erro: execute este script de dentro da pasta 'mock'" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Iniciando MOCK SERVER (porta 5000)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "node server.js"

Start-Sleep -Seconds 2

Write-Host "🌐 Iniciando SERVIDOR WEB (porta 8080)..." -ForegroundColor Cyan
Start-Process -NoNewWindow -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd ..; npx http-server -c-1 . -p 8080"

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "✅ Tudo pronto!" -ForegroundColor Green
Write-Host "📱 Abra seu navegador em:" -ForegroundColor Yellow
Write-Host "   http://localhost:8080" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏹️  Para parar, feche os dois terminais que abriram." -ForegroundColor Gray
