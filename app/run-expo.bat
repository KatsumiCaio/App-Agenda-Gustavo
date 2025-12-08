@echo off
chcp 65001
cd /d "%~dp0"
node node_modules\.bin\expo start --clear
pause
