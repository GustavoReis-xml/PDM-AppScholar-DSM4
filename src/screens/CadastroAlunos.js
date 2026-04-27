import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';

export default function CadastroAlunos() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [semestre, setSemestre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Exemplo de integração com IBGE Localidades
    const fetchEstadosIBGE = async () => {
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados');
        const estados = await res.json();
        console.log(`[IBGE] ${estados.length} estados carregados.`);
      } catch (e) {
        console.log('Erro IBGE', e);
      }
    };
    fetchEstadosIBGE();
  }, []);

  const handleCepChange = async (text) => {
    const rawCep = text.replace(/\D/g, '');
    setCep(text);
    
    // Integração ViaCEP
    if (rawCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          setCidade(data.localidade || '');
          setEstado(data.uf || '');
        }
      } catch (e) {
        console.log('Erro ao buscar CEP', e);
      }
    }
  };

  const handleCadastrar = async () => {
    if (!nome || !matricula || !email || !semestre) {
      Alert.alert('Erro', 'Por favor, preencha pelo menos Nome, Matrícula, Email e Semestre.');
      return;
    }

    if (!email.endsWith('@fatec.sp.gov.br')) {
      Alert.alert('E-mail Inválido', 'O e-mail deve ser institucional terminando com @fatec.sp.gov.br');
      return;
    }
    
    setLoading(true);
    try {
      const dados = { 
        nome, matricula, curso, email, 
        senha: 'aluno', // Senha padrão para login
        telefone, cep, rua, numero, bairro, cidade, estado, semestre
      };
      
      await apiFetch('/alunos', {
        method: 'POST',
        body: JSON.stringify(dados)
      });

      Alert.alert('Sucesso', 'Aluno cadastrado com sucesso no banco de dados!');
      setNome(''); setMatricula(''); setCurso(''); setEmail(''); setSemestre('');
      setTelefone(''); setCep(''); setRua(''); setNumero(''); setBairro(''); setCidade(''); setEstado('');
    } catch (err) {
      Alert.alert('Erro', err.message || 'Falha ao cadastrar o aluno.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Novo Aluno</Text>
        <Text style={globalStyles.subtitle}>Preencha os dados acadêmicos do estudante</Text>

        <CustomInput label="Nome Completo" placeholder="Ex: João da Silva" value={nome} onChangeText={setNome} icon="person-outline" />
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <CustomInput label="Matrícula" placeholder="Ex: 123456" value={matricula} onChangeText={setMatricula} icon="id-card-outline" keyboardType="numeric" />
          </View>
          <View style={{ flex: 1 }}>
            <CustomInput label="Semestre" placeholder="Ex: 1º Semestre" value={semestre} onChangeText={setSemestre} icon="calendar-outline" />
          </View>
        </View>

        <CustomInput label="Curso" placeholder="Ex: Análise de Sistemas" value={curso} onChangeText={setCurso} icon="book-outline" />
        <CustomInput label="E-mail" placeholder="Ex: joao@fatec.sp.gov.br" value={email} onChangeText={setEmail} icon="mail-outline" />
        <CustomInput label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChangeText={setTelefone} icon="call-outline" />
        
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
             <CustomInput label="CEP" placeholder="00000-000" value={cep} onChangeText={handleCepChange} icon="location-outline" />
          </View>
          <View style={{ flex: 1 }}>
             <CustomInput label="Estado" placeholder="Ex: SP" value={estado} onChangeText={setEstado} icon="map-outline" />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 3 }}>
             <CustomInput label="Rua" placeholder="Av. Principal" value={rua} onChangeText={setRua} icon="home-outline" />
          </View>
          <View style={{ flex: 1 }}>
             <CustomInput label="Nº" placeholder="100" value={numero} onChangeText={setNumero} keyboardType="numeric" />
          </View>
        </View>

        <CustomInput label="Bairro" placeholder="Centro" value={bairro} onChangeText={setBairro} icon="business-outline" />
        <CustomInput label="Cidade" placeholder="Ex: Jacareí" value={cidade} onChangeText={setCidade} icon="business-outline" />

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Salvando..." : "Salvar Cadastro"} 
            onPress={handleCadastrar} 
            color={colors.success} 
            icon="save-outline" 
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}