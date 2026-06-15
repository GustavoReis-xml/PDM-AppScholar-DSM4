import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil({ navigation }) {
  const { usuario, logout } = useAuth();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Sair', 'Tem certeza que deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { 
        text: 'Sair', 
        style: 'destructive',
        onPress: logout 
      }
    ]);
  };

  const handleMudarSenha = async () => {
    if (!novaSenha || !confirmaSenha) {
      showAlert('Aviso', 'Preencha a nova senha e a confirmação.');
      return;
    }
    if (novaSenha !== confirmaSenha) {
      showAlert('Aviso', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/perfil/senha', {
        method: 'PUT',
        body: JSON.stringify({ nova_senha: novaSenha })
      });
      showAlert('Sucesso', 'Senha alterada com sucesso!');
      setNovaSenha('');
      setConfirmaSenha('');
    } catch (err) {
      showAlert('Erro', err.message || 'Falha ao alterar senha.');
    } finally {
      setLoading(false);
    }
  };

  const infoItem = (icon, label, value) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value || 'Não informado'}</Text>
      </View>
    </View>
  );

  return (
    <GlassBackground>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 100, paddingBottom: 60 }} 
        showsVerticalScrollIndicator={false}
      >
        
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Ionicons name="person" size={50} color={colors.primaryDark} />
          </View>
          <Text style={globalStyles.title}>{usuario?.nome}</Text>
          <Text style={styles.roleBadge}>{usuario?.perfil?.toUpperCase()}</Text>
        </View>

        <SafeBlurView intensity={70} tint="light" style={[styles.card, globalStyles.shadow]}>
          <Text style={styles.sectionTitle}>Meus Dados</Text>
          
          {infoItem('mail-outline', 'E-mail Institucional', usuario?.email)}
          
          {usuario?.perfil === 'aluno' && (
            <>
              {infoItem('id-card-outline', 'Matrícula', usuario?.matricula)}
              {infoItem('book-outline', 'Curso', usuario?.curso)}
              {infoItem('calendar-outline', 'Semestre', usuario?.semestre)}
            </>
          )}

          {usuario?.perfil === 'professor' && (
            <>
              {infoItem('ribbon-outline', 'Titulação', usuario?.titulacao)}
              {infoItem('briefcase-outline', 'Área de Atuação', usuario?.area)}
            </>
          )}
          
        </SafeBlurView>

        <SafeBlurView intensity={70} tint="light" style={[styles.card, globalStyles.shadow]}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          
          <CustomInput
            label="Nova Senha"
            placeholder="Digite a nova senha"
            value={novaSenha}
            onChangeText={setNovaSenha}
            secureTextEntry
          />
          <View style={{ marginTop: 8 }}>
            <CustomInput
              label="Confirmar Senha"
              placeholder="Digite novamente"
              value={confirmaSenha}
              onChangeText={setConfirmaSenha}
              secureTextEntry
            />
          </View>
          
          <View style={{ marginTop: 16 }}>
            <CustomButton 
              title={loading ? "Salvando..." : "Salvar Nova Senha"} 
              onPress={handleMudarSenha} 
              color={colors.primary} 
              icon="key-outline" 
            />
          </View>
        </SafeBlurView>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color={colors.danger} />
          <Text style={styles.logoutText}>Encerrar Sesso</Text>
        </TouchableOpacity>

      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: colors.surface,
  },
  roleBadge: {
    backgroundColor: colors.primary,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primaryDark,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textLight,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: colors.dangerLight,
    padding: 16,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontFamily: fonts.bold,
    color: colors.danger,
    fontSize: 16,
    marginLeft: 8,
  }
});
