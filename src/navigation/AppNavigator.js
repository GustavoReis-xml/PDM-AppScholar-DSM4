import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors, fonts } from '../styles/globalStyles';

import Login from '../screens/Login';
import EsqueciSenha from '../screens/EsqueciSenha';
import Dashboard from '../screens/Dashboard';
import CadastroAlunos from '../screens/CadastroAlunos';
import CadastroProfessores from '../screens/CadastroProfessores';
import CadastroDisciplinas from '../screens/CadastroDisciplinas';
import Boletim from '../screens/Boletim';
import ListaAlunos from '../screens/ListaAlunos';
import ListaProfessores from '../screens/ListaProfessores';
import ListaDisciplinas from '../screens/ListaDisciplinas';
import LancarNotas from '../screens/LancarNotas';
import Perfil from '../screens/Perfil';
import GerenciarMatriculas from '../screens/GerenciarMatriculas';

const Stack = createNativeStackNavigator();

// Estilo padrão do header para todas as telas
const defaultScreenOptions = {
  headerStyle: {
    backgroundColor: 'transparent',
  },
  headerTransparent: true,
  headerTintColor: colors.primaryDark,
  headerTitleStyle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.text,
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: {
    backgroundColor: 'transparent',
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={defaultScreenOptions}>
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EsqueciSenha" 
          component={EsqueciSenha} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ headerShown: false, headerBackVisible: false }}
        />
        <Stack.Screen name="CadastroAlunos" component={CadastroAlunos} options={{ title: 'Novo Aluno' }} />
        <Stack.Screen name="CadastroProfessores" component={CadastroProfessores} options={{ title: 'Novo Professor' }} />
        <Stack.Screen name="CadastroDisciplinas" component={CadastroDisciplinas} options={{ title: 'Nova Disciplina' }} />
        <Stack.Screen name="ListaAlunos" component={ListaAlunos} options={{ title: 'Alunos' }} />
        <Stack.Screen name="ListaProfessores" component={ListaProfessores} options={{ title: 'Professores' }} />
        <Stack.Screen name="ListaDisciplinas" component={ListaDisciplinas} options={{ title: 'Disciplinas' }} />
        <Stack.Screen name="Boletim" component={Boletim} options={{ title: 'Boletim Acadêmico' }} />
        <Stack.Screen name="LancarNotas" component={LancarNotas} options={{ title: 'Lançar Notas' }} />
        <Stack.Screen name="GerenciarMatriculas" component={GerenciarMatriculas} options={{ title: 'Matrículas' }} />
        <Stack.Screen name="Perfil" component={Perfil} options={{ title: 'Meu Perfil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}