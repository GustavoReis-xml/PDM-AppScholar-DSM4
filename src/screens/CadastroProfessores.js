import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';

export default function CadastroProfessores() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [tempoDocencia, setTempoDocencia] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastrar = async () => {
    if (!nome || !titulacao || !email) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos Nome, Titulação e Email.');
      return;
    }

    if (!email.endsWith('@fatec.sp.gov.br')) {
      Alert.alert('E-mail Inválido', 'O e-mail deve ser institucional terminando com @fatec.sp.gov.br');
      return;
    }
    
    setLoading(true);
    try {
      const dados = { 
        nome, 
        titulacao, 
        area: areaAtuacao, 
        tempo_docencia: parseInt(tempoDocencia) || 0, 
        email, 
        senha: '123' 
      };
      
      await apiFetch('/professores', {
        method: 'POST',
        body: JSON.stringify(dados)
      });

      Alert.alert('Sucesso', 'Professor cadastrado com sucesso no banco de dados!');
      setNome(''); setTitulacao(''); setAreaAtuacao(''); setTempoDocencia(''); setEmail('');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao cadastrar o professor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Novo Professor</Text>
        <Text style={globalStyles.subtitle}>Preencha os dados do docente</Text>

        <CustomInput label="Nome Completo" placeholder="Ex: André Olímpio" value={nome} onChangeText={setNome} icon="person-outline" />
        <CustomInput label="Titulação" placeholder="Ex: Especialista, Mestre, Doutor" value={titulacao} onChangeText={setTitulacao} icon="ribbon-outline" />
        <CustomInput label="Área de Atuação" placeholder="Ex: Desenvolvimento Mobile" value={areaAtuacao} onChangeText={setAreaAtuacao} icon="briefcase-outline" />
        <CustomInput label="Tempo de Docência" placeholder="Ex: 5" value={tempoDocencia} onChangeText={setTempoDocencia} icon="time-outline" keyboardType="numeric" />
        <CustomInput label="E-mail" placeholder="Ex: professor@fatec.sp.gov.br" value={email} onChangeText={setEmail} icon="mail-outline" />

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Salvando..." : "Salvar Cadastro"} 
            onPress={handleCadastrar} 
            color="#0891B2" 
            icon="save-outline" 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}