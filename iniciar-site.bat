@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Iniciando o site em http://localhost:8000  (feche esta janela para parar)
start "" http://localhost:8000
where py >nul 2>nul && (py -m http.server 8000 & goto :eof)
where python >nul 2>nul && (python -m http.server 8000 & goto :eof)
echo.
echo Python nao encontrado. Instale em https://www.python.org/downloads/ (marque "Add python.exe to PATH").
pause
