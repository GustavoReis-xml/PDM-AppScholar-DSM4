import SafeKeyboard from '../components/SafeKeyboard';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';

export default function CadastroDisciplinas({ route, navigation }) {
  const discEdit = route?.params?.disciplina;
  const [nome, setNome] = useState(discEdit?.nome || '');
  const [cargaHoraria, setCargaHoraria] = useState(discEdit ? String(discEdit.carga_horaria) : '');
  const [professorId, setProfessorId] = useState(discEdit ? String(discEdit.professor_id) : '');
  const [curso, setCurso] = useState(discEdit?.curso || '');
  const [semestre, setSemestre] = useState(discEdit?.semestre || '');
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
      Alert.alert('Erro', 'Por favor, preencha pelo menos o Nome, Professor e Curso.');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    console.log('[CadastroDisciplinas] Iniciando submissão...');
    try {
      const dados = { 
        nome, 
        curso, 
        semestre, 
        professor_id: professorId || null 
      };
      
      if (discEdit) {
        console.log('[CadastroDisciplinas] Enviando PUT...');
        await apiFetch(`/disciplinas/${discEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(dados)
        });
        console.log('[CadastroDisciplinas] PUT sucesso.');
        Alert.alert('Sucesso', 'Disciplina atualizada com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        console.log('[CadastroDisciplinas] Enviando POST...');
        await apiFetch('/disciplinas', {
          method: 'POST',
          body: JSON.stringify(dados)
        });
        console.log('[CadastroDisciplinas] POST sucesso.');
        Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setNome(''); setCurso(''); setSemestre(''); setProfessorId('');
            }
          }
        ]);
      }
    } catch (err) {
      console.error('[CadastroDisciplinas] Erro detectado:', err);
      Alert.alert('Erro', err.message || 'Falha ao cadastrar disciplina.');
    } finally {
      setLoading(false);
      console.log('[CadastroDisciplinas] Submissão finalizada.');
    }
  };

  return (
    <GlassBackground>
      <SafeKeyboard style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 100, paddingBottom: Platform.OS === 'android' ? 300 : 60 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={globalStyles.title}>{discEdit ? 'Editar Disciplina' : 'Nova Disciplina'}</Text>
        <Text style={globalStyles.subtitle}>{discEdit ? 'Atualize as informações da matéria' : 'Cadastre as informações da matéria'}</Text>

        <CustomInput label="Nome da disciplina" placeholder="Ex: Programação Mobile I" value={nome} onChangeText={setNome} icon="library-outline" />
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <CustomInput label="Carga horária" placeholder="Ex: 80" value={cargaHoraria} onChangeText={setCargaHoraria} icon="time-outline" keyboardType="numeric" maxLength={4} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.pickerLabel}>SEMESTRE</Text>
            <View style={[styles.pickerWrapper, { marginBottom: 0, height: 58, justifyContent: 'center' }]}>
              <Picker selectedValue={semestre} onValueChange={(val) => setSemestre(val)}>
                <Picker.Item label="Selecione..." value="" />
                <Picker.Item label="1º Semestre" value="1º Semestre" />
                <Picker.Item label="2º Semestre" value="2º Semestre" />
                <Picker.Item label="3º Semestre" value="3º Semestre" />
                <Picker.Item label="4º Semestre" value="4º Semestre" />
                <Picker.Item label="5º Semestre" value="5º Semestre" />
                <Picker.Item label="6º Semestre" value="6º Semestre" />
              </Picker>
            </View>
          </View>
        </View>
        
        {/* Picker de Professor */}
        <Text style={styles.pickerLabel}>PROFESSOR RESPONSÁVEL</Text>
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

        <Text style={styles.pickerLabel}>CURSO VINCULADO</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={curso} onValueChange={(val) => setCurso(val)}>
            <Picker.Item label="Selecione o curso..." value="" />
            <Picker.Item label="Análise e Desenv. de Sistemas" value="Análise e Desenv. de Sistemas" />
            <Picker.Item label="Desenv. de Software Multiplataforma" value="Desenv. de Software Multiplataforma" />
            <Picker.Item label="Gestão da Tecnãologia da Informação" value="Gestão da Tecnãologia da Informação" />
            <Picker.Item label="Logística" value="Logística" />
            <Picker.Item label="Gestão de Recursos Humanãos" value="Gestão de Recursos Humanãos" />
          </Picker>
        </View>

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Salvando..." : "Salvar Cadastro"} 
            onPress={handleCadastrar} 
            color="#D97706" 
            icon="save-outline" 
          />
        </View>
      </ScrollView>
      </SafeKeyboard>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  pickerLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    backgroundColor: colors.surface,
    marginBottom: 20,
    overflow: 'hidden',
  },
});
