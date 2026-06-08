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

export default function CadastroAlunos({ route, navigation }) {
  const alunoEdit = route?.params?.aluno;
  const [nome, setNome] = useState(alunoEdit?.nome || '');
  const [matricula, setMatricula] = useState(alunoEdit?.matricula || '');
  const [curso, setCurso] = useState(alunoEdit?.curso || '');
  const [email, setEmail] = useState(alunoEdit?.email || '');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState(alunoEdit?.telefone || '');
  const [cep, setCep] = useState(alunoEdit?.cep || '');
  const [rua, setRua] = useState(alunoEdit?.rua || '');
  const [numero, setNumero] = useState(alunoEdit?.numero || '');
  const [bairro, setBairro] = useState(alunoEdit?.bairro || '');
  const [semestre, setSemestre] = useState(alunoEdit?.semestre || '');
  const [loading, setLoading] = useState(false);

  // IBGE Localidades
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState(alunoEdit?.estado || '');
  const [cidades, setCidades] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState(alunoEdit?.cidade || '');

  // Carregar estados do IBGE ao iniciar a tela
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const res = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await res.json();
        setEstados(data);
      } catch (e) {
        console.log('Erro ao buscar estados IBGE:', e);
      }
    };
    fetchEstados();
  }, []);

  // Carregar cidades quando o estado muda
  useEffect(() => {
    if (!estadoSelecionado) {
      setCidades([]);
      setCidadeSelecionada('');
      return;
    }
    const fetchCidades = async () => {
      try {
        const res = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios?orderBy=nome`);
        const data = await res.json();
        setCidades(data);
      } catch (e) {
        console.log('Erro ao buscar cidades IBGE:', e);
      }
    };
    fetchCidades();
  }, [estadoSelecionado]);

  const handleTelefoneChange = (text) => {
    let raw = text.replace(/\D/g, '');
    if (raw.length > 11) raw = raw.slice(0, 11); // Max 11 digits
    let formatted = raw;
    if (raw.length > 2) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    }
    if (raw.length > 6) {
      // 11 digits: (XX) XXXXX-XXXX
      // 10 digits: (XX) XXXX-XXXX
      if (raw.length === 11) {
        formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
      } else {
        formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 6)}-${raw.slice(6)}`;
      }
    }
    setTelefone(formatted);
  };

  const handleCepChange = async (text) => {
    let rawCep = text.replace(/\D/g, '');
    if (rawCep.length > 8) rawCep = rawCep.slice(0, 8); // Max 8 digits
    
    let formattedCep = rawCep;
    if (rawCep.length > 5) {
      formattedCep = `${rawCep.slice(0, 5)}-${rawCep.slice(5)}`;
    }
    setCep(formattedCep);
    
    // Integração ViaCEP
    if (rawCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setRua(data.logradouro || '');
          setBairro(data.bairro || '');
          const uf = data.uf || '';
          setEstadoSelecionado(uf);
          setTimeout(() => setCidadeSelecionada(data.localidade || ''), 800);
        }
      } catch (e) {
        console.log('Erro ao buscar CEP', e);
      }
    }
  };

  const handleCadastrar = async () => {
    if (!nome || !matricula || !curso || !semestre || (!alunoEdit && !email) || (!alunoEdit && !senha)) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    if (!alunoEdit && !email.endsWith('@fatec.sp.gov.br')) {
      Alert.alert('E-mail Inválido', 'O e-mail deve ser institucional terminando com @fatec.sp.gov.br');
      return;
    }
    
    Keyboard.dismiss();
    setLoading(true);
    console.log('[CadastroAlunos] Iniciando submissão...');
    try {
      const dados = { 
        nome, matricula, curso, email, 
        senha,
        telefone, cep, rua, numero, bairro, 
        cidade: cidadeSelecionada, 
        estado: estadoSelecionado, 
        semestre
      };
      
      if (alunoEdit) {
        console.log('[CadastroAlunos] Enviando PUT...');
        await apiFetch(`/alunos/${alunoEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(dados)
        });
        console.log('[CadastroAlunos] PUT sucesso.');
        Alert.alert('Sucesso', 'Aluno atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        console.log('[CadastroAlunos] Enviando POST...');
        await apiFetch('/alunos', {
          method: 'POST',
          body: JSON.stringify(dados)
        });
        console.log('[CadastroAlunos] POST sucesso.');
        Alert.alert('Sucesso', 'Aluno cadastrado com sucesso no banco de dados!', [
          {
            text: 'OK',
            onPress: () => {
              setNome(''); setMatricula(''); setCurso(''); setEmail(''); setSemestre(''); setSenha('');
              setTelefone(''); setCep(''); setRua(''); setNumero(''); setBairro('');
              setEstadoSelecionado(''); setCidadeSelecionada(''); setCidades([]);
            }
          }
        ]);
      }
    } catch (err) {
      console.error('[CadastroAlunos] Erro detectado:', err);
      Alert.alert('Erro', err.message || 'Falha ao cadastrar o aluno.');
    } finally {
      setLoading(false);
      console.log('[CadastroAlunos] Submissão finalizada.');
    }
  };

  return (
    <GlassBackground>
      <SafeKeyboard style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 100, paddingBottom: Platform.OS === 'android' ? 300 : 60 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={globalStyles.title}>{alunoEdit ? 'Editar Aluno' : 'Novo Aluno'}</Text>
        <Text style={globalStyles.subtitle}>{alunoEdit ? 'Atualize os dados acadêmicos do estudante' : 'Preencha os dados acadêmicos do estudante'}</Text>

        <CustomInput label="Nome Completo" placeholder="Ex: João da Silva" value={nome} onChangeText={setNome} icon="person-outline" />
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <CustomInput label="Matrícula" placeholder="Ex: 123456" value={matricula} onChangeText={setMatricula} icon="id-card-outline" keyboardType="numeric" maxLength={20} />
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

        <Text style={[styles.pickerLabel, { marginTop: 20 }]}>CURSO</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={curso} onValueChange={(val) => setCurso(val)}>
            <Picker.Item label="Selecione o curso..." value="" />
            <Picker.Item label="Análise e Desenv. de Sistemas" value="Análise e Desenv. de Sistemas" />
            <Picker.Item label="Desenv. de Software Multiplataforma" value="Desenv. de Software Multiplataforma" />
            <Picker.Item label="Gestão da Tecnologia da Informação" value="Gestão da Tecnologia da Informação" />
            <Picker.Item label="Logística" value="Logística" />
            <Picker.Item label="Gestão de Recursos Humanos" value="Gestão de Recursos Humanos" />
          </Picker>
        </View>
        
        {!alunoEdit && (
          <>
            <CustomInput label="E-mail" placeholder="Ex: joao@fatec.sp.gov.br" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
            <CustomInput label="Senha Provisória" placeholder="Defina uma senha de acesso" value={senha} onChangeText={setSenha} icon="lock-closed-outline" secureTextEntry />
          </>
        )}
        
        <CustomInput label="Telefone" placeholder="(00) 00000-0000" value={telefone} onChangeText={handleTelefoneChange} icon="call-outline" keyboardType="phone-pad" maxLength={15} />
        
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
             <CustomInput label="CEP" placeholder="00000-000" value={cep} onChangeText={handleCepChange} icon="location-outline" keyboardType="numeric" maxLength={9} />
          </View>
          <View style={{ flex: 1 }}>
             <CustomInput label="Nº" placeholder="100" value={numero} onChangeText={setNumero} keyboardType="numeric" maxLength={10} />
          </View>
        </View>

        <CustomInput label="Rua" placeholder="Av. Principal" value={rua} onChangeText={setRua} icon="home-outline" />
        <CustomInput label="Bairro" placeholder="Centro" value={bairro} onChangeText={setBairro} icon="business-outline" />

        {/* IBGE: Estado */}
        <Text style={styles.pickerLabel}>ESTADO</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={estadoSelecionado}
            onValueChange={(value) => {
              setEstadoSelecionado(value);
              setCidadeSelecionada('');
            }}
          >
            <Picker.Item label="Selecione o estado..." value="" />
            {estados.map((e) => (
              <Picker.Item key={e.sigla} label={`${e.nome} (${e.sigla})`} value={e.sigla} />
            ))}
          </Picker>
        </View>

        {/* IBGE: Cidade */}
        <Text style={styles.pickerLabel}>CIDADE</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={cidadeSelecionada}
            onValueChange={(value) => setCidadeSelecionada(value)}
            enabled={cidades.length > 0}
          >
            <Picker.Item label={cidades.length > 0 ? "Selecione a cidade..." : "Selecione um estado primeiro"} value="" />
            {cidades.map((c) => (
              <Picker.Item key={c.id} label={c.nome} value={c.nome} />
            ))}
          </Picker>
        </View>

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Salvando..." : "Salvar Cadastro"} 
            onPress={handleCadastrar} 
            color={colors.success} 
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
