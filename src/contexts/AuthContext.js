import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega os dados salvos no AsyncStorage ao iniciar o app
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        if (token) {
          const usuarioData = await AsyncStorage.getItem('@usuario');
          if (usuarioData) {
            setUsuario(JSON.parse(usuarioData));
          }
        }
      } catch (e) {
        console.log('Erro ao carregar dados do usuário:', e);
      } finally {
        setCarregando(false);
      }
    };
    carregarUsuario();
  }, []);

  // Salva os dados do usuário no contexto e no AsyncStorage
  const salvarUsuario = async (dados) => {
    // 'dados' vem do backend como res.data.usuario, e o token separado
    await AsyncStorage.setItem('@token', dados.token);
    // Mas note que no Login.js passamos: salvarUsuario({ token, ...usuario })
    // Então 'dados' contém tudo.
    await AsyncStorage.setItem('@usuario', JSON.stringify(dados));
    setUsuario(dados);
  };

  // Limpa tudo (logout)
  const logout = async () => {
    await AsyncStorage.clear();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, carregando, salvarUsuario, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
