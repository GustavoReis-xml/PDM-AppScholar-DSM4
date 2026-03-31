import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importação dos esqueletos das telas que criamos acima
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import CadastroAlunos from '../screens/CadastroAlunos';
import CadastroProfessores from '../screens/CadastroProfessores';
import CadastroDisciplinas from '../screens/CadastroDisciplinas';
import Boletim from '../screens/Boletim';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} // Esconde o cabeçalho no login
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ title: 'Painel Principal', headerBackVisible: false }} // Evita voltar pro login pelo botão nativo
        />
        <Stack.Screen name="CadastroAlunos" component={CadastroAlunos} options={{ title: 'Novo Aluno' }} />
        <Stack.Screen name="CadastroProfessores" component={CadastroProfessores} options={{ title: 'Novo Professor' }} />
        <Stack.Screen name="CadastroDisciplinas" component={CadastroDisciplinas} options={{ title: 'Nova Disciplina' }} />
        <Stack.Screen name="Boletim" component={Boletim} options={{ title: 'Boletim Acadêmico' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}