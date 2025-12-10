#!/usr/bin/env pwsh
# Define a codificação para UTF-8 para evitar problemas com caracteres especiais
$OutputEncoding = [System.Text.Encoding]::UTF8

# Script para iniciar o app Agenda Tatuador
Write-Host "Iniciando Agenda Tatuador App..." -ForegroundColor Green
Write-Host "No diretorio:" (Get-Location).Path -ForegroundColor Cyan
Write-Host ""

# Tenta iniciar o app com o comando padrão do expo
Write-Host "Tentando iniciar com 'npx expo start'..." -ForegroundColor Yellow
try {
    # Usar npx para executar expo.
    # --clear limpa o cache do bundler.
    # --tunnel permite acesso de outros dispositivos.
    & npx expo start --clear --tunnel
} catch {
    Write-Host "Ocorreu um erro. Tentando uma abordagem alternativa..." -ForegroundColor Red
    Write-Host "Detalhes do erro: $($_.Exception.Message)" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "Tentando com '@expo/cli@latest'..." -ForegroundColor Yellow
    
    # Tenta usar a versão mais recente do expo-cli.
    # Pode resolver problemas se o expo-cli local estiver desatualizado ou corrompido.
    & npx @expo/cli@latest start --clear --tunnel
}
