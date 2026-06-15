import SafeKeyboard from '../components/SafeKeyboard';
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import SafeBlurView from '../components/SafeBlurView';
import GlassBackground from '../components/GlassBackground';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, fonts } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import * as Haptics from 'expo-haptics';

export default function EsqueciSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleReset = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!email || !novaSenha || !confirmarSenha) {
      showAlert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      showAlert('Erro', 'As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    try {
      await apiFetch('/reset-password', {
        method: 'PUT',
        body: JSON.stringify({ email, nova_senha: novaSenha }),
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showAlert('Sucesso', 'Sua senha foi redefinida com sucesso!', [
        { text: 'Ir para o Login', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlert('Erro', err.message || 'Falha ao redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassBackground>
      <SafeKeyboard 
        style={{ flex: 1 }} 
        behavior="padding"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Recuperar Acesso</Text>
              <Text style={styles.subtitle}>Digite seu e-mail cadastrado e defina uma nova senha para sua conta.</Text>
            </View>

            <SafeBlurView intensity={70} tint="light" style={styles.formCard}>
              <CustomInput 
                label="E-mail" 
                placeholder="ex: aluno@fatec.sp.gov.br" 
                value={email} 
                onChangeText={setEmail} 
                icon="mail-outline" 
                keyboardType="email-address" 
                autoCapitalize="none" 
              />
              <CustomInput 
                label="Nova Senha" 
                placeholder="Sua nova senha secreta" 
                value={novaSenha} 
                onChangeText={setNovaSenha} 
                icon="lock-closed-outline" 
                secureTextEntry 
              />
              <CustomInput 
                label="Confirmar Senha" 
                placeholder="Repita a nova senha" 
                value={confirmarSenha} 
                onChangeText={setConfirmarSenha} 
                icon="lock-closed-outline" 
                secureTextEntry 
              />

              <View style={styles.buttonContainer}>
                {loading ? (
                  <ActivityIndicator size="large" color={colors.primary} />
                ) : (
                  <CustomButton title="Redefinir Senha" onPress={handleReset} color={colors.primary} icon="checkmark-circle-outline" />
                )}
              </View>

              <CustomButton title="Voltar" onPress={() => navigation.goBack()} variant="outline" color={colors.textLight} />
            </SafeBlurView>
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
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.extraBold,
    color: colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formCard: {
    borderRadius: 30,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
});
