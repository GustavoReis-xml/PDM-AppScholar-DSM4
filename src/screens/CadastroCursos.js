import React, { useState } from 'react';
import { View, Text, ScrollView, Platform, Keyboard } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import GlassBackground from '../components/GlassBackground';
import SafeKeyboard from '../components/SafeKeyboard';
import { apiFetch } from '../services/api';
import { globalStyles, colors } from '../styles/globalStyles';
import { useAlert } from '../contexts/AlertContext';

export default function CadastroCursos({ route, navigation }) {
  const cursoEdit = route?.params?.curso;
  const [nome, setNome] = useState(cursoEdit?.nome || '');
  const [area, setArea] = useState(cursoEdit?.area || '');
  const [duracao, setDuracao] = useState(cursoEdit?.duracao ? String(cursoEdit.duracao) : '');
  const [coordenador, setCoordenador] = useState(cursoEdit?.coordenador || '');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleSalvar = async () => {
    if (!nome.trim()) {
      showAlert('Campo obrigatório', 'O nome do curso é obrigatório.');
      return;
    }
    if (!area.trim()) {
      showAlert('Campo obrigatório', 'A área de atuação é obrigatória.');
      return;
    }
    if (!duracao || isNaN(duracao) || parseInt(duracao) <= 0) {
      showAlert('Campo inválido', 'Informe uma duração válida em semestres.');
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    const dados = { 
      nome: nome.trim(), 
      area: area.trim(), 
      duracao: parseInt(duracao), 
      coordenador: coordenador.trim() 
    };

    try {
      if (cursoEdit) {
        await apiFetch(`/cursos/${cursoEdit.id}`, { method: 'PUT', body: JSON.stringify(dados) });
        showAlert('Sucesso', 'Curso atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        await apiFetch('/cursos', { method: 'POST', body: JSON.stringify(dados) });
        showAlert('Sucesso', 'Curso cadastrado com sucesso!', [
          { 
            text: 'OK', 
            onPress: () => {
              setNome(''); 
              setArea(''); 
              setDuracao(''); 
              setCoordenador('');
            }
          }
        ]);
      }
    } catch (error) {
      showAlert('Erro', error.message || 'Falha ao salvar curso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassBackground>
      <SafeKeyboard style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ 
            flexGrow: 1, 
            paddingHorizontal: 20, 
            paddingTop: 100, 
            paddingBottom: Platform.OS === 'android' ? 200 : 60 
          }} 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
        >
          <Text style={globalStyles.title}>{cursoEdit ? 'Editar Curso' : 'Novo Curso'}</Text>
          <Text style={globalStyles.subtitle}>
            {cursoEdit 
              ? 'Atualize as informações do curso' 
              : 'Preencha os dados para cadastrar um novo curso'
            }
          </Text>

          <CustomInput 
            label="Nome do Curso" 
            placeholder="Ex: Análise e Desenv. de Sistemas" 
            value={nome} 
            onChangeText={setNome} 
            icon="school-outline" 
          />

          <CustomInput 
            label="Área de Atuação" 
            placeholder="Ex: Tecnologia da Informação" 
            value={area} 
            onChangeText={setArea} 
            icon="briefcase-outline" 
          />

          <CustomInput 
            label="Duração (Semestres)" 
            placeholder="Ex: 6" 
            value={duracao} 
            onChangeText={setDuracao} 
            keyboardType="numeric" 
            icon="time-outline"
            maxLength={2}
          />

          <CustomInput 
            label="Coordenador" 
            placeholder="Ex: Prof. André Olímpio" 
            value={coordenador} 
            onChangeText={setCoordenador} 
            icon="person-outline" 
          />

          <View style={{ marginBottom: 40, marginTop: 10 }}>
            <CustomButton 
              title={loading ? "Salvando..." : "Salvar Curso"} 
              onPress={handleSalvar} 
              color={colors.success} 
              icon="save-outline" 
            />
          </View>
        </ScrollView>
      </SafeKeyboard>
    </GlassBackground>
  );
}