import { StyleSheet } from 'react-native';

// ═══════════════════════════════════════════════════════
//  🎨 PALETA DE CORES — GLASSMORPHISM PREMIUM
// ═══════════════════════════════════════════════════════
export const colors = {
  // Translucidez
  glassSurface: 'rgba(255, 255, 255, 0.65)',
  glassSurfaceAlt: 'rgba(255, 255, 255, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.8)',

  // Sólidas p/ textos e ícones
  background: '#F8FAFC',
  surface: '#FFFFFF',

  // Primária (Roxo vibrante)
  primary: '#8B5CF6',
  primaryDark: '#6D28D9',
  primaryLight: 'rgba(139, 92, 246, 0.15)', // Light com opacidade

  // Sucesso (Verde menta)
  success: '#34D399',
  successDark: '#059669',
  successLight: 'rgba(52, 211, 153, 0.15)',

  // Alerta (Rosa coral)
  danger: '#FB7185',
  dangerLight: 'rgba(251, 113, 133, 0.15)',

  // Aviso
  warning: '#FBBF24',
  warningLight: 'rgba(251, 191, 36, 0.15)',

  // Texto
  text: '#1E293B',
  textLight: '#475569',
  textMuted: '#94A3B8',

  // Extras
  white: '#FFFFFF',
  accent: '#0EA5E9',
  accentLight: 'rgba(14, 165, 233, 0.15)',
};

// ═══════════════════════════════════════════════════════
//  🖋️ TIPOGRAFIA
// ═══════════════════════════════════════════════════════
export const fonts = {
  regular: 'Nunito_400Regular',
  semiBold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extraBold: 'Nunito_800ExtraBold',
};

// ═══════════════════════════════════════════════════════
//  📐 ESTILOS GLOBAIS
// ═══════════════════════════════════════════════════════
export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100, // Espaço para o header transparente
  },
  title: {
    fontSize: 28,
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginBottom: 24,
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  
  // Card em estilo de vidro (precisa ser usado com BlurView nas telas para o efeito real)
  card: {
    backgroundColor: colors.glassSurface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    // Sombra suave e difusa
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 4,
  },

  // Card listagem (menor shadow)
  cardList: {
    backgroundColor: colors.glassSurface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center'
  },

  // Sombra genérica premium
  shadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 5,
  },
});