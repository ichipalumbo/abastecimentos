@echo off
REM Script para rodar Abastecimentos (mock + servidor web)
REM Clique duplo para executar

echo.
echo ========================================
echo  🚀 ABASTECIMENTOS - Iniciando...
echo ========================================
echo.

REM Verifica se está na pasta correta (mock)
if not exist "server.js" (
    echo.
    echo ❌ ERRO: Execute este arquivo de dentro da pasta 'mock'
    echo.
    pause
    exit /b 1
)

REM Abre terminal 1: Mock Server
echo 📦 Abrindo MOCK SERVER (porta 5000)...
start cmd /k "node server.js"

REM Aguarda o mock iniciar
timeout /t 2 /nobreak

REM Abre terminal 2: Servidor web (volta para raiz)
echo 🌐 Abrindo SERVIDOR WEB (porta 8080)...
start cmd /k "cd .. && npx http-server -c-1 . -p 8080"

REM Aguarda
timeout /t 2 /nobreak

echo.
echo ========================================
echo  ✅ TUDO PRONTO!
echo ========================================
echo.
echo 📱 Abra seu navegador em:
echo    http://localhost:8080
echo.
echo ⏹️  Para parar, feche os dois terminais que abriram.
echo.
pause
