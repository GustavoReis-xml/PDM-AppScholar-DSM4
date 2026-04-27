import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';

export default function Dashboard({ navigation }) {
  const [perfil, setPerfil] = useState(null);
  const [nome, setNome] = useState('');

  useEffect(() => {
    const carregarDados = async () => {
      const p = await AsyncStorage.getItem('@perfil');
      const n = await AsyncStorage.getItem('@nome');
      setPerfil(p);
      setNome(n);
    };
    carregarDados();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  if (!perfil) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, globalStyles.shadow]}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>Bem-vindo,</Text>
          <Text style={styles.userName}>{nome}</Text>
          <Text style={styles.userRole}>Perfil: {perfil.toUpperCase()}</Text>
        </View>
        <Ionicons name="log-out-outline" size={30} color={colors.danger} onPress={handleLogout} />
      </View>

      <Text style={styles.sectionTitle}>Menu Rápido</Text>
      <Text style={globalStyles.subtitle}>Escolha uma das opções abaixo para gerenciar o sistema acadêmico.</Text>

      <View style={styles.menuContainer}>
        
        {/* === ADMIN === */}
        {perfil === 'admin' && (
          <>
            <Text style={styles.groupTitle}>Cadastros</Text>
            <CustomButton title="Cadastro de Alunos" onPress={() => navigation.navigate('CadastroAlunos')} color={colors.secondary} icon="person-add-outline" />
            <CustomButton title="Cadastro de Professores" onPress={() => navigation.navigate('CadastroProfessores')} color="#0891B2" icon="school-outline" />
            <CustomButton title="Cadastro de Disciplinas" onPress={() => navigation.navigate('CadastroDisciplinas')} color={colors.warning} icon="library-outline" />
            
            <Text style={[styles.groupTitle, { marginTop: 15 }]}>Listagens</Text>
            <CustomButton title="Lista de Alunos" onPress={() => navigation.navigate('ListaAlunos')} color={colors.primary} icon="people-outline" />
            <CustomButton title="Lista de Professores" onPress={() => navigation.navigate('ListaProfessores')} color="#2563EB" icon="people-circle-outline" />
            <CustomButton title="Lista de Disciplinas" onPress={() => navigation.navigate('ListaDisciplinas')} color="#D97706" icon="list-outline" />
            
            <Text style={[styles.groupTitle, { marginTop: 15 }]}>Gestão Acadêmica</Text>
            <CustomButton title="Lançar Notas" onPress={() => navigation.navigate('LancarNotas')} color="#10B981" icon="create-outline" />
          </>
        )}

        {/* === PROFESSOR === */}
        {perfil === 'professor' && (
          <>
            <CustomButton title="Lista de Alunos" onPress={() => navigation.navigate('ListaAlunos')} color={colors.primary} icon="people-outline" />
            <CustomButton title="Lista de Disciplinas" onPress={() => navigation.navigate('ListaDisciplinas')} color="#D97706" icon="list-outline" />
            <CustomButton title="Lançar Notas" onPress={() => navigation.navigate('LancarNotas')} color="#10B981" icon="create-outline" />
            <CustomButton title="Consulta de Boletim" onPress={() => navigation.navigate('Boletim')} color="#8B5CF6" icon="document-text-outline" />
          </>
        )}

        {/* === ALUNO === */}
        {perfil === 'aluno' && (
          <>
            <CustomButton title="Meu Boletim" onPress={() => navigation.navigate('Boletim')} color="#8B5CF6" icon="document-text-outline" />
          </>
        )}

        {/* === ADMIN pode ver Boletim também === */}
        {perfil === 'admin' && (
           <CustomButton title="Consulta de Boletim" onPress={() => navigation.navigate('Boletim')} color="#8B5CF6" icon="document-text-outline" />
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#E0E7FF',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  greeting: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  userRole: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  },
  menuContainer: {
    width: '100%',
    gap: 12, // Espaçamento moderno entre os botões
    paddingBottom: 40,
  }
});