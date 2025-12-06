import { Platform } from 'react-native';

// Paleta de cores baseada na logo Gustavo Tattoo
export const Colors = {
  // Cores Primárias
  primary: '#FF6B35',        // Laranja Quente
  primaryDark: '#E63946',    // Vermelho
  accent: '#FFB703',         // Amarelo Ouro
  
  // Cores de Fundo
  background: '#1C1C1C',     // Preto Profundo
  backgroundLight: '#2A2A2A', // Cinza Escuro
  surface: '#F5F5F5',        // Branco/Cinza Claro
  
  // Cores de Status
  success: '#4CAF50',        // Verde
  warning: '#FFA500',        // Laranja
  error: '#E63946',          // Vermelho
  info: '#FF6B35',           // Laranja Quente
  
  // Cores de Texto
  text: '#1C1C1C',           // Preto
  textLight: '#F5F5F5',      // Branco
  textMuted: '#999999',      // Cinza
  
  // Cores Neutras
  border: '#E0E0E0',
  divider: '#EEEEEE',
};

// Sombras modernas
export const Shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
    web: {
      boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.15)',
    },
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
    web: {
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    },
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
    web: {
      boxShadow: '0px 8px 12px rgba(0, 0, 0, 0.25)',
    },
  }),
};
