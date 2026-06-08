import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';

export default function ListaDisciplinas({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { usuario } = useAuth();
  const perfil = usuario?.perfil;

  useEffect(() => {
    carregarDisciplinas();
  }, []);

  const carregarDisciplinas = async () => {
    try {
      let data = [];
      if (perfil === 'professor') {
        data = await apiFetch(`/disciplinas/professor/${usuario.id}`);
      } else {
        data = await apiFetch('/disciplinas');
      }
      setDisciplinas(data);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao carregar disciplinas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarDisciplinas();
  };

  const handleDeletar = (id, nome) => {
    Alert.alert(
      'Excluir Disciplina',
      `Tem certeza que deseja excluir ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiFetch(`/disciplinas/${id}`, { method: 'DELETE' });
              Alert.alert('Sucesso', 'Disciplina excluda.');
              carregarDisciplinas();
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
        <Ionicons name="library" size={22} color="#D97706" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.info}>Curso: {item.curso}</Text>
        <Text style={styles.info}>Semestre: {item.semestre} | CH: {item.carga_horaria}h</Text>
        <Text style={styles.info}>Prof: {item.professor_nome || 'Nenhum'}</Text>
      </View>
      {perfil === 'admin' && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('CadastroDisciplinas', { disciplina: item })} style={[styles.actionBtn, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="pencil-outline" size={20} color={colors.warning} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletar(item.id, item.nome)} style={[styles.actionBtn, { backgroundColor: colors.dangerLight, marginLeft: 8 }]}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      )}
    </SafeBlurView>
  );

  const disciplinasFiltradas = disciplinas.filter(d => d.nome.toLowerCase().includes(search.toLowerCase()) || (d.curso && d.curso.toLowerCase().includes(search.toLowerCase())));

  return (
    <GlassBackground>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Disciplinas</Text>
        <Text style={globalStyles.subtitle}>Grade curricular</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou curso..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={disciplinasFiltradas}
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
    borderLeftColor: '#D97706',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: colors.warningLight,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nome: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#D97706',
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
