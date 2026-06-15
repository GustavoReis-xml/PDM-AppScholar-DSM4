import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';
import CustomButton from '../components/CustomButton';

export default function GerenciarMatriculas({ route, navigation }) {
  const { aluno } = route.params;
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    carregarMatriculas();
  }, []);

  const carregarMatriculas = async () => {
    try {
      const data = await apiFetch(`/matriculas/${aluno.id}`);
      setDisciplinas(data);
    } catch (err) {
      showAlert('Erro', err.message || 'Falha ao carregar disciplinas');
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = (id) => {
    setDisciplinas(disciplinas.map(d => 
      d.id === id ? { ...d, matriculado: !d.matriculado } : d
    ));
  };

  const handleSalvar = async () => {
    showAlert(
      'Confirmar Matrículas',
      'Aviso: Desmatricular um aluno apagar quaisquer notas lançadas para ele naquela disciplina. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: async () => {
            setSaving(true);
            try {
              const ativas = disciplinas.filter(d => d.matriculado).map(d => d.id);
              await apiFetch(`/matriculas/${aluno.id}`, {
                method: 'POST',
                body: JSON.stringify({ disciplinasAtivas: ativas })
              });
              showAlert('Sucesso', 'Matrículas atualizadas com sucesso!');
              navigation.goBack();
            } catch (err) {
              showAlert('Erro', err.message || 'Falha ao salvar matrículas');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Agrupar disciplinas por semestre/curso para visualizao mais limpa
  const agrupadas = disciplinas.reduce((acc, curr) => {
    const key = `${curr.curso} - ${curr.semestre}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  return (
    <GlassBackground>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 100, paddingBottom: 60 }} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={globalStyles.title}>Matrículas</Text>
          <Text style={globalStyles.subtitle}>Gerenciando: {aluno.nome}</Text>
        </View>

        {Object.entries(agrupadas).map(([grupo, lista]) => (
          <View key={grupo} style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{grupo}</Text>
            
            {lista.map(d => (
              <SafeBlurView intensity={70} tint="light" style={styles.card} key={d.id}>
                <View style={{ flex: 1, paddingRight: 10 }}>
                  <Text style={styles.discName}>{d.nome}</Text>
                </View>
                <Switch
                  trackColor={{ false: '#d1d5db', true: colors.successLight }}
                  thumbColor={d.matriculado ? colors.success : '#f8f9fa'}
                  ios_backgroundColor="#d1d5db"
                  style={{ transform: [{ scale: 1.15 }] }}
                  onValueChange={() => toggleSwitch(d.id)}
                  value={d.matriculado}
                />
              </SafeBlurView>
            ))}
          </View>
        ))}

        <View style={{ marginTop: 20 }}>
          <CustomButton 
            title={saving ? "Salvando..." : "Salvar Matrículas"} 
            onPress={handleSalvar} 
            color={colors.primary} 
            icon="save-outline" 
          />
        </View>
      </ScrollView>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 10,
  },
  groupContainer: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  discName: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: colors.text,
  }
});
