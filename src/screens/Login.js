import SafeKeyboard from '../components/SafeKeyboard';
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeBlurView from '../components/SafeBlurView';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import GlassBackground from '../components/GlassBackground';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import * as Haptics from 'expo-haptics';

export default function Login({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { salvarUsuario } = useAuth();

  const handleLogin = async () => {
    if (login.trim() === '' || senha.trim() === '') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    setErro('');
    setLoading(true);

    try {
      const response = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email: login, senha })
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      await salvarUsuario({
        token: response.token,
        perfil: response.usuario.perfil,
        nome: response.usuario.nome,
        id: response.usuario.id,
        matricula: response.usuario.matricula || null
      });

      navigation.replace('Dashboard'); 
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setErro(error.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (email, pass) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLogin(email);
    setSenha(pass);
    setErro('');
  };

  return (
    <GlassBackground>
      <SafeKeyboard 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: Platform.OS === 'android' ? 300 : 0 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            {/* Header com logo */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoInner}>
                  <Ionicons name="school" size={48} color={colors.white} />
                </View>
              </View>
              <Text style={styles.title}>App Scholar</Text>
              <Text style={styles.tagline}>Portal Acadêmico Institucional</Text>
            </View>

            {/* Formulário - BlurView Card */}
            <SafeBlurView intensity={70} tint="light" style={styles.formCard}>
              <CustomInput
                label="E-mail"
                placeholder="seu.email@fatec.sp.gov.br"
                value={login}
                onChangeText={setLogin}
                icon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <CustomInput
                label="Senha"
                placeholder="Digite sua senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={true}
                icon="lock-closed-outline"
              />

              {erro !== '' && (
                <View style={styles.errorContainer}>
                  <View style={styles.errorIcon}>
                    <Ionicons name="alert-circle" size={18} color={colors.danger} />
                  </View>
                  <Text style={styles.errorText}>{erro}</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <CustomButton 
                    title="Acessar o Sistema" 
                    onPress={handleLogin} 
                    icon="log-in-outline"
                  />
                )}
              </View>

              <TouchableOpacity 
                style={{ alignItems: 'center', marginTop: 10, padding: 10 }}
                onPress={() => navigation.navigate('EsqueciSenha')}
              >
                <Text style={{ fontFamily: fonts.bold, color: colors.primaryDark, fontSize: 14 }}>
                  Esqueci minha senha
                </Text>
              </TouchableOpacity>
            </SafeBlurView>

            {/* Botões de Login Rápido (Teste) */}
            <View style={styles.quickSection}>
              <Text style={styles.quickLabel}>a Login Rápido (Teste)</Text>
              <View style={styles.quickRow}>
                <TouchableOpacity 
                  style={[styles.quickBtn, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]} 
                  onPress={() => quickLogin('admin@fatec.sp.gov.br', 'admin')}
                >
                  <Ionicons name="shield-checkmark" size={18} color={colors.primaryDark} />
                  <Text style={[styles.quickBtnText, { color: colors.primaryDark }]}>Admin</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.quickBtn, { backgroundColor: 'rgba(14, 165, 233, 0.2)' }]} 
                  onPress={() => quickLogin('alberto@fatec.sp.gov.br', 'prof123')}
                >
                  <Ionicons name="school" size={18} color={colors.accent} />
                  <Text style={[styles.quickBtnText, { color: colors.accent }]}>Professor</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.quickBtn, { backgroundColor: 'rgba(52, 211, 153, 0.2)' }]} 
                  onPress={() => quickLogin('lucas@fatec.sp.gov.br', 'aluno123')}
                >
                  <Ionicons name="person" size={18} color={colors.successDark} />
                  <Text style={[styles.quickBtnText, { color: colors.successDark }]}>Aluno</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeKeyboard>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 60,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 36,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textLight,
    marginTop: 4,
  },
  formCard: {
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden', // Importante pro blurview
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  errorIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    flex: 1,
  },
  quickSection: {
    marginTop: 28,
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 6,
  },
  quickBtnText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
});
