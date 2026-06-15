import SafeKeyboard from '../components/SafeKeyboard';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAlert } from '../contexts/AlertContext';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import { apiFetch } from '../services/api';
import useAuth from '../hooks/useAuth';
import GlassBackground from '../components/GlassBackground';
import SafeBlurView from '../components/SafeBlurView';
export default function LancarNotas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [disciplinaId, setDisciplinaId] = useState('');
  const [alunoId, setAlunoId] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();
  const { showAlert } = useAlert();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Busca disciplinas (professor vê apenas as suas, admin vê todas)
        let disciplinasData = [];
        if (usuario?.perfil === 'professor') {
          disciplinasData = await apiFetch(`/disciplinas/professor/${usuario.id}`);
        } else {
          disciplinasData = await apiFetch('/disciplinas');
        }
        setDisciplinas(disciplinasData);
      } catch (err) {
        showAlert('Erro', err.message || 'Falha ao carregar dados iniciais');
      }
    };
    carregarDados();
  }, []);

  const handleSalvar = async () => {
    if (!disciplinaId || !alunoId || !nota1 || !nota2) {
      showAlert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação de intervalo 0 a 10
    const n1 = parseFloat(nota1);
    const n2 = parseFloat(nota2);
    if (isNaN(n1) || isNaN(n2) || n1 < 0 || n1 > 10 || n2 < 0 || n2 > 10) {
      showAlert('Nota Inválida', 'As notas devem ser valores numéricos entre 0 e 10.');
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

      showAlert('Sucesso', 'Notas salvas com sucesso!');
      setNota1('');
      setNota2('');
      setAlunoId('');
    } catch (err) {
      showAlert('Erro', err.message || 'Falha ao lançar nota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassBackground>
      <SafeKeyboard style={{ flex: 1 }} behavior="padding">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 100, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Text style={globalStyles.title}>Lançar Notas</Text>
      <Text style={globalStyles.subtitle}>Insira ou atualize as notas do aluno</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Disciplina</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={disciplinaId}
            onValueChange={async (itemValue) => {
              setDisciplinaId(itemValue);
              setAlunoId('');
              if (itemValue) {
                try {
                  const alunosData = await apiFetch(`/disciplinas/${itemValue}/alunos`);
                  setAlunos(alunosData);
                } catch (err) {
                  showAlert('Erro', 'Falha ao buscar alunos da disciplina');
                }
              } else {
                setAlunos([]);
              }
            }}
            style={styles.picker}
          >
            <Picker.Item label="Selecione a disciplina..." value="" style={styles.pickerItem} />
            {disciplinas.map((d) => (
              <Picker.Item key={d.id} label={`${d.nome} (${d.curso})`} value={String(d.id)} style={styles.pickerItem} />
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
            style={styles.picker}
            enabled={!!disciplinaId} // Desabilita se não tiver disciplina selecionada
          >
            <Picker.Item label={disciplinaId ? "Selecione o aluno..." : "Selecione uma disciplina primeiro..."} value="" style={styles.pickerItem} />
            {alunos.map((a) => (
                <Picker.Item key={a.id} label={`${a.nome} (${a.matricula})`} value={String(a.id)} style={styles.pickerItem} />
            ))}
          </Picker>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Notas</Text>
      <View style={styles.notasRow}>
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

      <View style={styles.buttonContainer}>
        <CustomButton 
          title={loading ? "Salvando..." : "Salvar Notas"} 
          onPress={handleSalvar} 
          color={colors.primary} 
          icon="save-outline" 
        />
      </View>
      </ScrollView>
      </SafeKeyboard>
    </GlassBackground>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    marginBottom: 20,
  },
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
    overflow: 'hidden',
  },
  picker: {
    fontFamily: fonts.regular,
  },
  pickerItem: {
    fontFamily: fonts.regular,
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  notasRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 40,
    marginTop: 24,
  },
});
