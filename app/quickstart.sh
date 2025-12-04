#!/bin/bash
# QUICK START - Agenda Tatuador App

echo "======================================"
echo "🚀 AGENDA TATUADOR - QUICK START"
echo "======================================"
echo ""

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não está instalado!"
    echo "Instale Node.js em: https://nodejs.org/"
    exit 1
fi

echo "✅ npm encontrado"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
echo "   Isto pode demorar 15-30 minutos..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Dependências instaladas com sucesso!"
    echo ""
    echo "======================================"
    echo "🎉 PRONTO PARA USAR!"
    echo "======================================"
    echo ""
    echo "1. Instale Expo Go no celular:"
    echo "   iOS: App Store"
    echo "   Android: Google Play"
    echo ""
    echo "2. Execute no terminal:"
    echo "   npm start"
    echo ""
    echo "3. Escaneie o QR code com o Expo Go"
    echo ""
    echo "4. Aproveite o app! 🎨"
    echo ""
else
    echo ""
    echo "❌ Erro ao instalar dependências"
    echo "Tente executar:"
    echo "  rm -rf node_modules package-lock.json"
    echo "  npm install"
fi
