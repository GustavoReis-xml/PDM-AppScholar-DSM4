import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroAlunos() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const handleCadastrar = () => {
    if (!nome || !matricula || !email) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos Nome, Matrícula e Email.');
      return;
    }
    console.log('--- Novo Aluno Cadastrado ---');
    console.log({ nome, matricula, curso, email, telefone, cep, endereco, cidade, estado });
    Alert.alert('Sucesso', 'Aluno cadastrado com sucesso!');
    setNome(''); setMatricula(''); setCurso(''); setEmail('');
    setTelefone(''); setCep(''); setEndereco(''); setCidade(''); setEstado('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Novo Aluno</Text>
        <Text style={globalStyles.subtitle}>Preencha os dados acadêmicos do estudante</Text>

        <CustomInput label="Nome Completo" placeholder="Ex: João da Silva" value={nome} onChangeText={setNome} icon="person-outline" />
        <CustomInput label="Matrícula" placeholder="Ex: 123456" value={matricula} onChangeText={setMatricula} icon="id-card-outline" />
        <CustomInput label="Curso" placeholder="Ex: Análise de Sistemas" value={curso} onChangeText={setCurso} icon="book-outline" />
        <CustomInput label="E-mail" placeholder="Ex: joao@fatec.sp.gov.br" value={email} onChangeText={setEmail} icon="mail-outline" />
        <CustomInput label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChangeText={setTelefone} icon="call-outline" />
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
             <CustomInput label="CEP" placeholder="00000-000" value={cep} onChangeText={setCep} icon="location-outline" />
          </View>
          <View style={{ flex: 1 }}>
             <CustomInput label="Estado" placeholder="Ex: SP" value={estado} onChangeText={setEstado} icon="map-outline" />
          </View>
        </View>

        <CustomInput label="Endereço" placeholder="Rua, Número, Bairro" value={endereco} onChangeText={setEndereco} icon="home-outline" />
        <CustomInput label="Cidade" placeholder="Ex: Jacareí" value={cidade} onChangeText={setCidade} icon="business-outline" />

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton title="Salvar Cadastro" onPress={handleCadastrar} color={colors.success} icon="save-outline" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}