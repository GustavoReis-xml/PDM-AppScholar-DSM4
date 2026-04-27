import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';

export default function LancarNotas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [disciplinaId, setDisciplinaId] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const perfil = await AsyncStorage.getItem('@perfil');
        const userId = await AsyncStorage.getItem('@id');

        // Busca alunos
        const alunosData = await apiFetch('/alunos');
        setAlunos(alunosData);

        // Busca disciplinas
        let disciplinasData = [];
        if (perfil === 'professor') {
          disciplinasData = await apiFetch(`/disciplinas/professor/${userId}`);
        } else {
          disciplinasData = await apiFetch('/disciplinas');
        }
        setDisciplinas(disciplinasData);
      } catch (err) {
        Alert.alert('Erro', err.message || 'Falha ao carregar dados iniciais');
      }
    };
    carregarDados();
  }, []);

  const handleSalvar = async () => {
    if (!disciplinaId || !alunoId || !nota1 || !nota2) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await apiFetch('/notas', {
        method: 'POST',
        body: JSON.stringify({
          disciplina_id: parseInt(disciplinaId),
          aluno_id: parseInt(alunoId),
          nota1: parseFloat(nota1),
          nota2: parseFloat(nota2)
        })
      });

      Alert.alert('Sucesso', 'Notas salvas com sucesso!');
      setNota1('');
      setNota2('');
      setAlunoId('');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao lançar nota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <Text style={globalStyles.title}>Lançar Notas</Text>
      <Text style={globalStyles.subtitle}>Insira ou atualize as notas do aluno</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Disciplina</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={disciplinaId}
            onValueChange={(itemValue) => setDisciplinaId(itemValue)}
          >
            <Picker.Item label="Selecione a disciplina..." value="" />
            {disciplinas.map((d) => (
              <Picker.Item key={d.id} label={`${d.nome} (${d.curso})`} value={String(d.id)} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Aluno</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={alunoId}
            onValueChange={(itemValue) => setAlunoId(itemValue)}
          >
            <Picker.Item label="Selecione o aluno..." value="" />
            {alunos.map((a) => (
              <Picker.Item key={a.id} label={`${a.nome} (${a.matricula})`} value={String(a.id)} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 15, marginTop: 10 }}>
        <View style={{ flex: 1 }}>
          <CustomInput 
            label="Nota 1" 
            placeholder="0.0 a 10.0" 
            value={nota1} 
            onChangeText={setNota1} 
            keyboardType="numeric" 
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput 
            label="Nota 2" 
            placeholder="0.0 a 10.0" 
            value={nota2} 
            onChangeText={setNota2} 
            keyboardType="numeric" 
          />
        </View>
      </View>

      <View style={{ marginBottom: 40, marginTop: 20 }}>
        <CustomButton 
          title={loading ? "Salvando..." : "Salvar Notas"} 
          onPress={handleSalvar} 
          color={colors.primary} 
          icon="save-outline" 
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textLight,
    marginBottom: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  }
});
