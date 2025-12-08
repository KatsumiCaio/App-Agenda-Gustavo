#!/usr/bin/env pwsh
$OutputEncoding = [System.Text.Encoding]::UTF8

# Script para iniciar o app Agenda Tatuador

$appPath = (Get-Location).Path
Write-Host "🚀 Iniciando Agenda Tatuador App" -ForegroundColor Green
Write-Host "📁 Diretório: $appPath" -ForegroundColor Cyan
Write-Host ""

# Tentar iniciar com expo
Write-Host "Tentando iniciar o app..." -ForegroundColor Yellow
Write-Host ""

try {
    # Usar npx para executar expo
    & npx expo start --clear --tunnel
} catch {
    Write-Host "❌ Erro ao iniciar: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tentando alternativa..." -ForegroundColor Yellow
    & npx @expo/cli@latest start --clear --tunnel
}
