import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';
export default function Boletim({ route }) {
  const paramMatricula = route?.params?.matricula;
  const [matricula, setMatricula] = useState(paramMatricula || '');
  const [boletim, setBoletim] = useState(null);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();
  const perfil = usuario?.perfil;
  const { showAlert } = useAlert();

  useEffect(() => {
    if (paramMatricula) {
      buscarBoletim(paramMatricula);
    } else if (perfil === 'aluno' && usuario?.matricula) {
      buscarBoletim(usuario.matricula);
    } else if (perfil === 'aluno') {
      showAlert('Erro', 'Matrícula não encontrada.');
    }
  }, [paramMatricula]);

  const buscarBoletim = async (matSearch) => {
    const mat = typeof matSearch === 'string' ? matSearch : matricula;
    if (!mat || !mat.trim()) {
      showAlert('Aviso', 'Digite a matrícula do aluno para buscar o boletim.');
      return;
    }
    
    setLoading(true);
    setBoletim(null);
    try {
      const data = await apiFetch(`/boletim/${mat}`);
      setBoletim(data);
    } catch (err) {
      showAlert('Erro', err.message || 'Boletim não encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isAprovado = item.situacao === 'Aprovado';
    const statusColor = isAprovado ? colors.success : colors.danger;
    const statusIcon = isAprovado ? 'checkmark-circle' : 'close-circle';

    return (
      <SafeBlurView intensity={70} tint="light" style={globalStyles.card}>
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
        
        <View style={[styles.resultadoContainer, { backgroundColor: isAprovado ? colors.successLight : colors.dangerLight }]}>
          <Ionicons name={statusIcon} size={24} color={statusColor} />
          <Text style={[styles.situacaoTexto, { color: statusColor }]}>
            STATUS: {item.situacao}
          </Text>
        </View>
      </SafeBlurView>
    );
  };

  return (
    <GlassBackground>
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
          <Text style={styles.loadingTexto}>Buscando notas não sistema...</Text>
        </View>
      )}

      {!loading && boletim && (
        <View style={{ flex: 1 }}>
          <SafeBlurView intensity={70} tint="light" style={styles.alunoInfo}>
            <View style={styles.alunoInfoHeader}>
              <View style={styles.alunoIconContainer}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.alunoNome}>{boletim.nome}</Text>
                <Text style={styles.alunoCurso}>{boletim.curso}</Text>
              </View>
            </View>
          </SafeBlurView>
          <FlatList
            data={boletim.disciplinas}
            keyExtractor={(item, index) => String(index)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma disciplina encontrada.</Text>
            }
          />
        </View>
      )}
      </View>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 20,
  },
  alunoInfo: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
  },
  alunoInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alunoIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alunoNome: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  alunoCurso: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textLight,
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingTexto: {
    marginTop: 15,
    fontSize: 16,
    fontFamily: fonts.semiBold,
    color: colors.textLight,
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
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disciplinaNome: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.bold,
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
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 8,
    marginLeft: 4,
  },
  notaLabel: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  notaValor: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  resultadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
    gap: 8,
  },
  situacaoTexto: {
    fontSize: 14,
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.textMuted,
  },
});
