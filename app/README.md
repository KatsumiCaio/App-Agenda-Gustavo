# Agenda Tatuador - App Mobile

Um aplicativo mobile simples e intuitivo para gerenciar a agenda de um tatuador. Totalmente desenvolvido em React Native com Expo, sem necessidade de login.

## 🎨 Funcionalidades

- ✅ **Menu de Navegação** - Acesso fácil às principais funcionalidades
- 📅 **Agenda com 3 Visualizações:**
  - **Visualização Diária** - Veja todos os agendamentos do dia
  - **Visualização Semanal** - Veja toda a semana de uma vez
  - **Visualização Mensal** - Veja o mês completo
- ➕ **Adicionar Agendamentos** - Crie novos agendamentos facilmente
- 📊 **Estatísticas** - Acompanhe total de tatuagens, agendadas, concluídas e canceladas
- 💾 **Armazenamento Local** - Todos os dados são salvos localmente (sem internet necessária)
- 🎯 **Status** - Gerenecie o status das tatuagens (agendado, concluído, cancelado)

## 📱 Páginas do App

### 1. Agenda (Aba 1)
Visualize todos os seus agendamentos com opções de filtro por período (dia, semana ou mês).

**Funcionalidades:**
- Alternar entre visualizações diária, semanal e mensal
- Navegar entre períodos com setas
- Botão "Hoje" para voltar ao dia atual
- Lista de tatuagens com informações completas

### 2. Agendar (Aba 2)
Formulário completo para adicionar um novo agendamento.

**Campos disponíveis:**
- Nome do cliente*
- Telefone
- Descrição da tatuagem*
- Local da tatuagem
- Valor (R$)*
- Data*
- Horário*
- Observações

\* = Campo obrigatório

### 3. Mais (Aba 3)
Visualize estatísticas e informações sobre o app.

**Informações:**
- Total de tatuagens
- Tatuagens agendadas
- Tatuagens concluídas
- Tatuagens canceladas
- Sobre o app

## 🚀 Como Usar

### Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd app
```

2. **Instale as dependências**
```bash
npm install
```

Ou com yarn:
```bash
yarn install
```

3. **Inicie o app**
```bash
npm start
```

4. **Escaneie o QR code com seu celular**
- Use o app **Expo Go** (disponível na App Store ou Google Play)
- Aponte a câmera para o QR code exibido no terminal
- O app será carregado automaticamente

### Adicionar um Agendamento

1. Toque na aba **"Agendar"**
2. Preencha os campos obrigatórios (nome, descrição, data, horário e valor)
3. Preencha os campos opcionais se desejar
4. Toque em **"Agendar Tatuagem"**

### Visualizar Agendamentos

1. Toque na aba **"Agenda"**
2. Escolha o tipo de visualização:
   - **Dia** - Veja os agendamentos de um dia específico
   - **Semana** - Veja a semana completa
   - **Mês** - Veja o mês inteiro
3. Use os botões **"← Anterior"** e **"Próximo →"** para navegar
4. Toque em **"Hoje"** para voltar ao dia atual

## 📊 Visualizar Estatísticas

1. Toque na aba **"Mais"**
2. Veja os cards com os números de:
   - Total de agendamentos
   - Tatuagens agendadas
   - Tatuagens concluídas
   - Tatuagens canceladas

## 💻 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **React Navigation** - Navegação entre telas
- **React Context API** - Gerenciamento de estado
- **AsyncStorage** - Armazenamento local de dados
- **date-fns** - Manipulação de datas
- **TypeScript** - Linguagem tipada

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── TatuagemItem.tsx # Card individual de tatuagem
│   │   └── ViewSelector.tsx # Seletor de visualizações
│   ├── contexts/            # Context API
│   │   └── AgendaContext.tsx # Contexto principal
│   ├── screens/             # Telas principais
│   │   ├── AgendaScreen.tsx
│   │   ├── AddTatuagemScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── services/            # Serviços
│   │   └── storage.ts       # Serviço de armazenamento
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/               # Funções utilitárias
│   │   └── dateHelper.ts
│   ├── Navigation.tsx       # Configuração de navegação
│   └── App.tsx              # Raiz da aplicação
├── app.json                 # Configuração Expo
├── babel.config.js          # Configuração Babel
├── tsconfig.json            # Configuração TypeScript
├── package.json             # Dependências
└── README.md                # Este arquivo
```

## 🔧 Configurações

### Adicionar Novas Dependências

```bash
npx expo install <package-name>
```

### Compilar APK (Android)

```bash
eas build --platform android
```

### Compilar para iOS

```bash
eas build --platform ios
```

## 📝 Notas Importantes

- **Sem Login** - O app não requer autenticação
- **Armazenamento Local** - Todos os dados são salvos no dispositivo
- **Offline** - Funciona totalmente offline após carregamento
- **Backup** - Considere fazer backup dos dados periodicamente

## 🐛 Troubleshooting

### O app não carrega
- Tente: `npm start` e depois apagar o cache com `Ctrl+C` e `npm start -- --clear`
- Certifique-se que o Expo Go está instalado

### Erro ao instalar dependências
```bash
rm -rf node_modules package-lock.json
npm install
```

### Problemas com AsyncStorage
- Verifique se `@react-native-async-storage/async-storage` está instalado
- Execute: `npx expo install @react-native-async-storage/async-storage`

## 📄 Licença

Este projeto é livre para uso pessoal e comercial.

## 👨‍💻 Desenvolvido por

App criado como solução simples para gerenciar agendas de tatuadores.

---

**Desenvolvido com ❤️ para tatuadores**
