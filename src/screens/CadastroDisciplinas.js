import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroDisciplinas() {
  const [nome, setNome] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [professor, setProfessor] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const handleCadastrar = () => {
    if (!nome || !professor || !curso) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos o Nome, Professor e Curso.');
      return;
    }
    console.log('--- Nova Disciplina Cadastrada ---');
    console.log({ nome, cargaHoraria, professor, curso, semestre });
    Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
    setNome(''); setCargaHoraria(''); setProfessor(''); setCurso(''); setSemestre('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Nova Disciplina</Text>
        <Text style={globalStyles.subtitle}>Cadastre as informações da matéria</Text>

        <CustomInput label="Nome da disciplina" placeholder="Ex: Programação Mobile I" value={nome} onChangeText={setNome} icon="library-outline" />
        <CustomInput label="Carga horária" placeholder="Ex: 80h" value={cargaHoraria} onChangeText={setCargaHoraria} icon="time-outline" />
        <CustomInput label="Professor responsável" placeholder="Ex: André Olímpio" value={professor} onChangeText={setProfessor} icon="person-circle-outline" />
        <CustomInput label="Curso" placeholder="Ex: Desenvolvimento de Software" value={curso} onChangeText={setCurso} icon="laptop-outline" />
        <CustomInput label="Semestre" placeholder="Ex: 4º Semestre" value={semestre} onChangeText={setSemestre} icon="calendar-outline" />

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton title="Salvar Cadastro" onPress={handleCadastrar} color={colors.warning} icon="save-outline" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}