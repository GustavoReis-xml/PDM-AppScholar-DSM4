import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';

import { apiFetch } from '../services/api';

export default function Login({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (login.trim() === '' || senha.trim() === '') {
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

      // Salvar token e perfil no AsyncStorage
      await AsyncStorage.setItem('@token', response.token);
      await AsyncStorage.setItem('@perfil', response.usuario.perfil);
      await AsyncStorage.setItem('@nome', response.usuario.nome);
      await AsyncStorage.setItem('@id', String(response.usuario.id));
      if (response.usuario.matricula) {
        await AsyncStorage.setItem('@matricula', response.usuario.matricula);
      }

      navigation.replace('Dashboard'); 
    } catch (error) {
      setErro(error.message || 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView impede que o teclado cubra os inputs
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, globalStyles.shadow]}>
          <Ionicons name="school" size={60} color={colors.primary} />
        </View>
        <Text style={styles.title}>App Scholar</Text>
        <Text style={globalStyles.subtitle}>Portal Acadêmico Institucional</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Credenciais de Acesso"
          placeholder="E-mail institucional"
          value={login}
          onChangeText={setLogin}
          icon="mail-outline"
        />

        <CustomInput
          placeholder="Sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={true}
          icon="lock-closed-outline"
        />

        {erro !== '' && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={16} color={colors.danger} />
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        )}

        <View style={{ marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Autenticando..." : "Acessar o Sistema"} 
            onPress={handleLogin} 
            icon="log-in-outline"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: colors.surface,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.primary,
    letterSpacing: -1,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    color: colors.danger,
    marginLeft: 8,
    fontWeight: '600',
  },
});