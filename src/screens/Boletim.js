import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../styles/globalStyles';

const dadosSimulados = [
  { id: '1', disciplina: 'Programação Mobile I', nota1: 8.5, nota2: 9.0, media: 8.75, situacao: 'Aprovado' },
  { id: '2', disciplina: 'Banco de Dados', nota1: 5.0, nota2: 6.0, media: 5.5, situacao: 'Reprovado' },
  { id: '3', disciplina: 'Engenharia de Software', nota1: 7.0, nota2: 7.5, media: 7.25, situacao: 'Aprovado' },
];

export default function Boletim() {
  const [boletim, setBoletim] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBoletim(dadosSimulados);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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
            <Text style={styles.notaValor}>{item.nota1.toFixed(1)}</Text>
          </View>
          <View style={styles.notaBox}>
            <Text style={styles.notaLabel}>Nota 2</Text>
            <Text style={styles.notaValor}>{item.nota2.toFixed(1)}</Text>
          </View>
          <View style={[styles.notaBox, styles.mediaBox]}>
            <Text style={[styles.notaLabel, { color: colors.primary }]}>Média</Text>
            <Text style={[styles.notaValor, { color: colors.primary }]}>{item.media.toFixed(2)}</Text>
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingTexto}>Buscando notas no sistema...</Text>
        </View>
      ) : (
        <FlatList
          data={boletim}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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