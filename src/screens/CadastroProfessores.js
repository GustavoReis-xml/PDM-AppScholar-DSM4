import SafeKeyboard from '../components/SafeKeyboard';
import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';

export default function CadastroProfessores({ route, navigation }) {
  const profEdit = route?.params?.professor;
  const [nome, setNome] = useState(profEdit?.nome || '');
  const [titulacao, setTitulacao] = useState(profEdit?.titulacao || '');
  const [areaAtuacao, setAreaAtuacao] = useState(profEdit?.area || '');
  const [tempoDocencia, setTempoDocencia] = useState(profEdit ? String(profEdit.tempo_docencia) : '');
  const [email, setEmail] = useState(profEdit?.email || '');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  const handleCadastrar = async () => {
    if (!nome || !titulacao || (!profEdit && !email) || (!profEdit && !senha)) {
      showAlert('Erro', 'Por favor, preencha os campos obrigatórios.');
      return;
    }

    if (!profEdit && !email.endsWith('@fatec.sp.gov.br')) {
      showAlert('E-mail Inválido', 'O e-mail deve ser institucional terminando com @fatec.sp.gov.br');
      return;
    }
    
    setLoading(true);
    console.log('[CadastroProfessores] Iniciando submissão...');
    try {
      const dados = { 
        nome, 
        titulacao, 
        area: areaAtuacao, 
        tempo_docencia: parseInt(tempoDocencia) || 0, 
        email, 
        senha
      };
      
      if (profEdit) {
        console.log('[CadastroProfessores] Enviando PUT...');
        await apiFetch(`/professores/${profEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(dados)
        });
        console.log('[CadastroProfessores] PUT sucesso.');
        showAlert('Sucesso', 'Professor atualizado com sucesso!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        console.log('[CadastroProfessores] Enviando POST...');
        await apiFetch('/professores', {
          method: 'POST',
          body: JSON.stringify(dados)
        });
        console.log('[CadastroProfessores] POST sucesso.');
        showAlert('Sucesso', 'Professor cadastrado com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              setNome(''); setTitulacao(''); setAreaAtuacao(''); setTempoDocencia(''); setEmail(''); setSenha('');
            }
          }
        ]);
      }
    } catch (err) {
      console.error('[CadastroProfessores] Erro detectado:', err);
      showAlert('Erro', err.message || 'Falha ao cadastrar o professor.');
    } finally {
      setLoading(false);
      console.log('[CadastroProfessores] Submissão finalizada.');
    }
  };

  return (
    <GlassBackground>
      <SafeKeyboard style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 100, paddingBottom: Platform.OS === 'android' ? 300 : 60 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={globalStyles.title}>{profEdit ? 'Editar Professor' : 'Novo Professor'}</Text>
        <Text style={globalStyles.subtitle}>{profEdit ? 'Atualize os dados do docente' : 'Preencha os dados do docente'}</Text>

        <CustomInput label="Nome Completo" placeholder="Ex: André Olímpio" value={nome} onChangeText={setNome} icon="person-outline" />
        <CustomInput label="Titulação" placeholder="Ex: Especialista, Mestre, Doutor" value={titulacao} onChangeText={setTitulacao} icon="ribbon-outline" />
        <CustomInput label="Área de Atuação" placeholder="Ex: Desenvolvimento Mobile" value={areaAtuacao} onChangeText={setAreaAtuacao} icon="briefcase-outline" />
        <CustomInput label="Tempo de Docência (anãos)" placeholder="Ex: 5" value={tempoDocencia} onChangeText={setTempoDocencia} icon="time-outline" keyboardType="numeric" />
        
        {!profEdit && (
          <>
            <CustomInput label="E-mail" placeholder="Ex: professor@fatec.sp.gov.br" value={email} onChangeText={setEmail} icon="mail-outline" keyboardType="email-address" autoCapitalize="none" />
            <CustomInput label="Senha Provisória" placeholder="Defina uma senha de acesso" value={senha} onChangeText={setSenha} icon="lock-closed-outline" secureTextEntry />
          </>
        )}

        <View style={{ marginBottom: 40, marginTop: 10 }}>
          <CustomButton 
            title={loading ? "Salvando..." : "Salvar Cadastro"} 
            onPress={handleCadastrar} 
            color={colors.accent} 
            icon="save-outline" 
          />
        </View>
      </ScrollView>
      </SafeKeyboard>
    </GlassBackground>
  );
}
