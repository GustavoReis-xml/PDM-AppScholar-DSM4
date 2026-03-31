import { StyleSheet } from 'react-native';

// Nossa paleta de cores profissional
export const colors = {
  primary: '#1E3A8A', // Azul escuro (Acadêmico)
  secondary: '#3B82F6', // Azul claro (Ações)
  background: '#F8FAFC', // Fundo off-white moderno
  surface: '#FFFFFF', // Cor dos cartões/inputs
  text: '#0F172A', // Texto principal (quase preto)
  textLight: '#64748B', // Texto secundário/subtítulos
  border: '#E2E8F0', // Bordas suaves
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 8,
    marginTop: 20,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 32,
    lineHeight: 24,
  },
  // Estilo de sombra reutilizável para dar profundidade
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  }
});