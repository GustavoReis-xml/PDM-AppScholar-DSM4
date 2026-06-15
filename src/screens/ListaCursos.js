import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';

export default function ListaCursos({ navigation }) {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { usuario } = useAuth();
  const perfil = usuario?.perfil;
  const { showAlert } = useAlert();

  const carregarCursos = useCallback(async () => {
    try {
      const data = await apiFetch('/cursos');
      setCursos(data);
    } catch (err) {
      showAlert('Erro', err.message || 'Falha ao carregar cursos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarCursos();
  }, [carregarCursos]);

  // Recarrega ao voltar de outra tela (ex: após editar/criar)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarCursos();
    });
    return unsubscribe;
  }, [navigation, carregarCursos]);

  const onRefresh = () => {
    setRefreshing(true);
    carregarCursos();
  };

  const handleDeletar = (id, nome) => {
    showAlert(
      'Excluir Curso',
      `Tem certeza que deseja excluir "${nome}"?\n\nAlunos vinculados a este curso não serão excluídos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiFetch(`/cursos/${id}`, { method: 'DELETE' });
              showAlert('Sucesso', 'Curso excluído com sucesso.');
              carregarCursos();
            } catch (err) {
              showAlert('Erro', err.message || 'Falha ao excluir curso.');
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <SafeBlurView intensity={70} tint="light" style={[styles.card, globalStyles.shadow]}>
      <View style={styles.iconContainer}>
        <Ionicons name="school" size={22} color="#7C3AED" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.info}>Área: {item.area || 'Não informada'}</Text>
        <Text style={styles.info}>Duração: {item.duracao ? `${item.duracao} semestres` : 'Não informada'}</Text>
        <Text style={styles.info}>Coordenador: {item.coordenador || 'Não informado'}</Text>
      </View>
      {perfil === 'admin' && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('CadastroCursos', { curso: item })} style={[styles.actionBtn, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="pencil-outline" size={20} color={colors.warning} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletar(item.id, item.nome)} style={[styles.actionBtn, { backgroundColor: colors.dangerLight, marginLeft: 8 }]}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      )}
    </SafeBlurView>
  );

  const cursosFiltrados = cursos.filter(c => 
    c.nome.toLowerCase().includes(search.toLowerCase()) || 
    (c.area && c.area.toLowerCase().includes(search.toLowerCase())) ||
    (c.coordenador && c.coordenador.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <GlassBackground>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Cursos</Text>
        <Text style={globalStyles.subtitle}>Cursos cadastrados na instituição</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome, área ou coordenador..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {perfil === 'admin' && (
          <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CadastroCursos')}>
            <Ionicons name="add-circle" size={22} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Novo Curso</Text>
          </TouchableOpacity>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : cursosFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum curso encontrado</Text>
            <Text style={styles.emptySubtext}>
              {search ? 'Tente alterar os termos de busca' : 'Cadastre o primeiro curso'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={cursosFiltrados}
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
    borderLeftColor: '#7C3AED',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nome: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#7C3AED',
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
    marginBottom: 16,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 14,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.textLight,
    marginTop: 16,
  },
  emptySubtext: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
});
