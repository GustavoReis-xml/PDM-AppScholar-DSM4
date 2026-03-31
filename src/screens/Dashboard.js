import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';

export default function Dashboard({ navigation }) {
  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, globalStyles.shadow]}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.greeting}>Bem-vindo,</Text>
          <Text style={styles.userName}>Administrador</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Menu Rápido</Text>
      <Text style={globalStyles.subtitle}>Escolha uma das opções abaixo para gerenciar o sistema acadêmico.</Text>

      <View style={styles.menuContainer}>
        <CustomButton 
          title="Cadastro de Alunos" 
          onPress={() => navigation.navigate('CadastroAlunos')} 
          color={colors.secondary} 
          icon="people-outline"
        />
        
        <CustomButton 
          title="Cadastro de Professores" 
          onPress={() => navigation.navigate('CadastroProfessores')} 
          color="#0891B2" // Ciano escuro
          icon="school-outline"
        />

        <CustomButton 
          title="Cadastro de Disciplinas" 
          onPress={() => navigation.navigate('CadastroDisciplinas')} 
          color={colors.warning} 
          icon="library-outline"
        />

        <CustomButton 
          title="Consulta de Boletim" 
          onPress={() => navigation.navigate('Boletim')} 
          color="#8B5CF6" // Roxo vibrante
          icon="document-text-outline"
        />
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