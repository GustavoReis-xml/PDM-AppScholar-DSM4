import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';

export default function ListaAlunos({ navigation }) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { usuario } = useAuth();
  const perfil = usuario?.perfil;

  useEffect(() => {
    carregarAlunos();
  }, []);

  const carregarAlunos = async () => {
    try {
      const data = await apiFetch('/alunos');
      setAlunos(data);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao carregar alunos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarAlunos();
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
    <SafeBlurView intensity={70} tint="light" style={[styles.card, globalStyles.shadow]}>
      <View style={styles.iconContainer}>
        <Ionicons name="person" size={22} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.info}>Matrícula: {item.matricula}</Text>
        <Text style={styles.info}>Curso: {item.curso} - {item.semestre}</Text>
        <Text style={styles.info}>{item.email}</Text>
      </View>
      {(perfil === 'admin' || perfil === 'professor') && (
        <View style={{ width: 90, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 }}>
          {perfil === 'admin' && (
            <TouchableOpacity onPress={() => navigation.navigate('GerenciarMatriculas', { aluno: item })} style={[styles.actionBtn, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="book-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Boletim', { matricula: item.matricula })} style={[styles.actionBtn, { backgroundColor: colors.infoLight }]}>
            <Ionicons name="reader-outline" size={20} color={colors.info} />
          </TouchableOpacity>
          {perfil === 'admin' && (
            <TouchableOpacity onPress={() => navigation.navigate('CadastroAlunos', { aluno: item })} style={[styles.actionBtn, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="pencil-outline" size={20} color={colors.warning} />
            </TouchableOpacity>
          )}
          {perfil === 'admin' && (
            <TouchableOpacity onPress={() => handleDeletar(item.id, item.nome)} style={[styles.actionBtn, { backgroundColor: colors.dangerLight }]}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeBlurView>
  );

  const alunosFiltrados = alunos.filter(a => a.nome.toLowerCase().includes(search.toLowerCase()) || a.matricula.includes(search));

  return (
    <GlassBackground>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Alunos</Text>
        <Text style={globalStyles.subtitle}>Lista de alunos matriculados</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar aluno por nome ou matrícula..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={alunosFiltrados}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          />
        )}
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nome: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.primary,
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
    lineHeight: 20,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassSurface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
});
