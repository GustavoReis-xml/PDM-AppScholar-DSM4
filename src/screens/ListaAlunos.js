import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';

export default function ListaAlunos() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const carregarTudo = async () => {
      const p = await AsyncStorage.getItem('@perfil');
      setPerfil(p);
      carregarAlunos();
    };
    carregarTudo();
  }, []);

  const carregarAlunos = async () => {
    try {
      const data = await apiFetch('/alunos');
      setAlunos(data);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao carregar alunos');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = (id, nome) => {
    Alert.alert(
      'Excluir Aluno',
      `Tem certeza que deseja excluir ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiFetch(`/alunos/${id}`, { method: 'DELETE' });
              Alert.alert('Sucesso', 'Aluno excluído.');
              carregarAlunos();
            } catch (err) {
              Alert.alert('Erro', err.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={[styles.card, globalStyles.shadow]}>
      <View style={styles.iconContainer}>
        <Ionicons name="person" size={24} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.info}>Matrícula: {item.matricula}</Text>
        <Text style={styles.info}>Curso: {item.curso} - {item.semestre}</Text>
        <Text style={styles.info}>{item.email}</Text>
      </View>
      {perfil === 'admin' && (
        <TouchableOpacity onPress={() => handleDeletar(item.id, item.nome)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Alunos</Text>
      <Text style={globalStyles.subtitle}>Lista de alunos matriculados</Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center'
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#EFF6FF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4
  },
  info: {
    fontSize: 14,
    color: colors.textLight,
  },
  deleteBtn: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
