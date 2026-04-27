import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../styles/globalStyles';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { apiFetch } from '../services/api';

export default function Boletim() {
  const [matricula, setMatricula] = useState('');
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(false);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const init = async () => {
      const p = await AsyncStorage.getItem('@perfil');
      setPerfil(p);
      if (p === 'aluno') {
        const mat = await AsyncStorage.getItem('@matricula');
        if (mat) {
          buscarBoletim(mat);
        } else {
          Alert.alert('Erro', 'Matrícula não encontrada.');
        }
      }
    };
    init();
  }, []);

  const buscarBoletim = async (matSearch) => {
    const mat = typeof matSearch === 'string' ? matSearch : matricula;
    if (!mat || !mat.trim()) {
      Alert.alert('Aviso', 'Digite a matrícula do aluno para buscar o boletim.');
      return;
    }
    
    setLoading(true);
    setBoletim(null);
    try {
      const data = await apiFetch(`/boletim/${mat}`);
      setBoletim(data);
    } catch (err) {
      Alert.alert('Erro', err.message || 'Boletim não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isAprovado = item.situacao === 'Aprovado';
    const statusColor = isAprovado ? colors.success : colors.danger;
    const statusIcon = isAprovado ? 'checkmark-circle' : 'close-circle';

    return (
      <View style={[styles.card, globalStyles.shadow]}>
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <Ionicons name="book" size={20} color={colors.primary} />
          </View>
          <Text style={styles.disciplinaNome}>{item.disciplina}</Text>
        </View>
        
        <View style={styles.notasContainer}>
          <View style={styles.notaBox}>
            <Text style={styles.notaLabel}>Nota 1</Text>
            <Text style={styles.notaValor}>{Number(item.nota1).toFixed(1)}</Text>
          </View>
          <View style={styles.notaBox}>
            <Text style={styles.notaLabel}>Nota 2</Text>
            <Text style={styles.notaValor}>{Number(item.nota2).toFixed(1)}</Text>
          </View>
          <View style={[styles.notaBox, styles.mediaBox]}>
            <Text style={[styles.notaLabel, { color: colors.primary }]}>Média</Text>
            <Text style={[styles.notaValor, { color: colors.primary }]}>{Number(item.media).toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={[styles.resultadoContainer, { backgroundColor: isAprovado ? '#ECFDF5' : '#FEF2F2' }]}>
          <Ionicons name={statusIcon} size={24} color={statusColor} />
          <Text style={[styles.situacaoTexto, { color: statusColor }]}>
            STATUS: {item.situacao}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Meu Boletim</Text>
      <Text style={globalStyles.subtitle}>Acompanhamento de desempenho acadêmico</Text>

      {perfil !== 'aluno' && (
        <View style={styles.searchContainer}>
          <CustomInput 
            placeholder="Digite a Matrícula" 
            value={matricula} 
            onChangeText={setMatricula} 
            icon="search-outline" 
          />
          <CustomButton 
            title="Buscar Boletim" 
            onPress={() => buscarBoletim(matricula)} 
            color={colors.primary} 
          />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTexto}>Buscando notas no sistema...</Text>
        </View>
      )}

      {!loading && boletim && (
        <View style={{ flex: 1 }}>
          <View style={styles.alunoInfo}>
            <Text style={styles.alunoNome}>{boletim.nome}</Text>
            <Text style={styles.alunoCurso}>{boletim.curso}</Text>
          </View>
          <FlatList
            data={boletim.disciplinas}
            keyExtractor={(item, index) => String(index)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Nenhuma disciplina encontrada.</Text>}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
  },
  alunoInfo: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  alunoCurso: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTexto: {
    marginTop: 15,
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disciplinaNome: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  notasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  notaBox: {
    alignItems: 'center',
    flex: 1,
  },
  mediaBox: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  notaLabel: {
    fontSize: 12,
    color: colors.textLight,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  notaValor: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  resultadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  situacaoTexto: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});