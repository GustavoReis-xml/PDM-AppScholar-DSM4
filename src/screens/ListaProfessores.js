import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';

export default function ListaProfessores({ navigation }) {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const { usuario } = useAuth();
  const perfil = usuario?.perfil;
  const { showAlert } = useAlert();

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const data = await apiFetch('/professores');
      setProfessores(data);
    } catch (err) {
      showAlert('Erro', err.message || 'Falha ao carregar professores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarProfessores();
  };

  const handleDeletar = (id, nome) => {
    showAlert(
      'Excluir Professor',
      `Tem certeza que deseja excluir ${nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiFetch(`/professores/${id}`, { method: 'DELETE' });
              showAlert('Sucesso', 'Professor excluído.');
              carregarProfessores();
            } catch (err) {
              showAlert('Erro', err.message);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <SafeBlurView intensity={70} tint="light" style={[styles.card, globalStyles.shadow]}>
      <View style={styles.iconContainer}>
        <Ionicons name="school" size={22} color="#0891B2" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.info}>Titulação: {item.titulacao}</Text>
        <Text style={styles.info}>rea: {item.area}</Text>
        <Text style={styles.info}>{item.email}</Text>
      </View>
      {perfil === 'admin' && (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('CadastroProfessores', { professor: item })} style={[styles.actionBtn, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="pencil-outline" size={20} color={colors.warning} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeletar(item.id, item.nome)} style={[styles.actionBtn, { backgroundColor: colors.dangerLight, marginLeft: 8 }]}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      )}
    </SafeBlurView>
  );

  const profsFiltrados = professores.filter(p => p.nome.toLowerCase().includes(search.toLowerCase()) || (p.titulacao && p.titulacao.toLowerCase().includes(search.toLowerCase())));

  return (
    <GlassBackground>
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Professores</Text>
        <Text style={globalStyles.subtitle}>Lista de docentes</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome ou titulação..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            data={profsFiltrados}
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
    borderLeftColor: '#0891B2',
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#E0F7FA',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  nome: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#0891B2',
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
