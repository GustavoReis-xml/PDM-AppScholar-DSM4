import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';

export default function CadastroDisciplinas() {
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [professorId, setProfessorId] = useState(''); // Usaremos ID para professor na API (foreign key)
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarProfessores();
  }, []);

  const carregarProfessores = async () => {
    try {
      const data = await apiFetch('/professores');
      setProfessores(data);
    } catch (err) {
      console.log('Erro ao carregar professores:', err);
    }
  };

  const handleCadastrar = async () => {
    if (!nome || !professorId || !curso) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos o Nome, ID do Professor e Curso.');
      return;
    }
    
    setLoading(true);
    try {
      const dados = { 
        nome, 
        carga_horaria: parseInt(cargaHoraria) || 0, 
        professor_id: parseInt(professorId), 
        curso, 
        semestre 
      };
      
      await apiFetch('/disciplinas', {
        method: 'POST',
        body: JSON.stringify(dados)
      });

      Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso no banco de dados!');
      setNome(''); setCargaHoraria(''); setProfessorId(''); setCurso(''); setSemestre('');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao cadastrar a disciplina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Nova Disciplina</Text>
        <Text style={globalStyles.subtitle}>Cadastre as informações da matéria</Text>

        <CustomInput label="Nome da disciplina" placeholder="Ex: Programação Mobile I" value={nome} onChangeText={setNome} icon="library-outline" />
        <CustomInput label="Carga horária" placeholder="Ex: 80" value={cargaHoraria} onChangeText={setCargaHoraria} icon="time-outline" keyboardType="numeric" />
        
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Professor Responsável</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={professorId}
              onValueChange={(itemValue) => setProfessorId(itemValue)}
            >
              <Picker.Item label="Selecione um professor..." value="" />
              {professores.map((prof) => (
                <Picker.Item key={prof.id} label={prof.nome} value={String(prof.id)} />
              ))}
            </Picker>
          </View>
        </View>

        <CustomInput label="Curso" placeholder="Ex: Desenvolvimento de Software" value={curso} onChangeText={setCurso} icon="laptop-outline" />
        <CustomInput label="Semestre" placeholder="Ex: 4º Semestre" value={semestre} onChangeText={setSemestre} icon="calendar-outline" />

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Salvando..." : "Salvar Cadastro"} 
            onPress={handleCadastrar} 
            color={colors.warning} 
            icon="save-outline" 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 15,
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