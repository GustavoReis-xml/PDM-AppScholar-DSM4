import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeBlurView from '../components/SafeBlurView';
import CustomButton from '../components/CustomButton';
import GlassBackground from '../components/GlassBackground';
import { colors, fonts, globalStyles } from '../styles/globalStyles';
import useAuth from '../hooks/useAuth';
import * as Haptics from 'expo-haptics';
import { apiFetch } from '../services/api';

export default function Dashboard({ navigation }) {
  const { usuario, logout } = useAuth();
  const [stats, setStats] = useState(null);

  const perfil = usuario?.perfil;
  const nome = usuario?.nome;

  useEffect(() => {
    if (!usuario) return;
    const fetchStats = async () => {
      try {
        if (perfil === 'admin') {
          const al = await apiFetch('/alunos');
          const pr = await apiFetch('/professores');
          setStats({ alunos: al.length, professores: pr.length });
        } else if (perfil === 'professor') {
          const d = await apiFetch(`/disciplinas/professor/${usuario.id}`);
          const al = await apiFetch('/alunos');
          setStats({ disciplinas: d.length, alunos: al.length });
        } else if (perfil === 'aluno') {
          const bol = await apiFetch(`/boletim/${usuario.matricula}`);
          let mediaGeral = 0;
          if (bol && bol.disciplinas && bol.disciplinas.length > 0) {
             const sum = bol.disciplinas.reduce((acc, curr) => acc + parseFloat(curr.media || 0), 0);
             mediaGeral = (sum / bol.disciplinas.length).toFixed(1);
          }
          setStats({ media: mediaGeral, totalDisciplinas: bol?.disciplinas?.length || 0 });
        }
      } catch (e) { console.log(e); }
    };
    fetchStats();
  }, [usuario, perfil]);

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await logout();
    navigation.replace('Login');
  };

  if (!perfil) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const perfilConfig = {
    admin: { label: 'Administrador', color: colors.primaryDark, bg: colors.primaryLight, icon: 'shield-checkmark' },
    professor: { label: 'Professor', color: '#0284C7', bg: colors.accentLight, icon: 'school' },
    aluno: { label: 'Aluno', color: '#059669', bg: colors.successLight, icon: 'person' },
  };
  const badge = perfilConfig[perfil] || perfilConfig.aluno;

  return (
    <GlassBackground>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 100, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        
        {/* Header - Glass Card */}
        <SafeBlurView intensity={60} tint="light" style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity style={[styles.avatar, { backgroundColor: badge.bg }]} onPress={() => navigation.navigate('Perfil')}>
              <Ionicons name={badge.icon} size={28} color={badge.color} />
            </TouchableOpacity>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.greeting}>Bem-vindo de volta =K</Text>
              <Text style={styles.userName} numberOfLines={1} adjustsFontSizeToFit>{nome}</Text>
            </View>
            <View style={styles.logoutBtn}>
              <Ionicons name="log-out-outline" size={24} color={colors.danger} onPress={handleLogout} />
            </View>
          </View>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Ionicons name={badge.icon} size={14} color={badge.color} />
            <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
          </View>
        </SafeBlurView>

        {/* Menu */}
        <View style={styles.menuContainer}>
          
          {/* === ADMIN === */}
          {perfil === 'admin' && (
            <>
              {stats && (
                <View style={styles.grid}>
                  <KpiCard icon="people" value={stats.alunos} label="Alunos Cadastrados" color={colors.primary} />
                  <KpiCard icon="school" value={stats.professores} label="Professores Ativos" color={colors.accent} />
                </View>
              )}
              
              <Text style={globalStyles.sectionLabel}>📋 Cadastros</Text>
              <View style={styles.grid}>
                <MenuCard icon="person-add" color={colors.primary} title="Alunos" onPress={() => navigation.navigate('CadastroAlunos')} />
                <MenuCard icon="school" color={colors.accent} title="Professores" onPress={() => navigation.navigate('CadastroProfessores')} />
              </View>
              <View style={styles.grid}>
                <MenuCard icon="library" color={colors.warning} title="Disciplinas" onPress={() => navigation.navigate('CadastroDisciplinas')} />
                <MenuCard icon="create" color={colors.success} title="Lançar Notas" onPress={() => navigation.navigate('LancarNotas')} />
              </View>

              <Text style={globalStyles.sectionLabel}>📋 Listagens</Text>
              <CustomButton title="Lista de Alunos" onPress={() => navigation.navigate('ListaAlunos')} color={colors.primary} icon="people-outline" />
              <View style={{ height: 12 }} />
              <CustomButton title="Lista de Professores" onPress={() => navigation.navigate('ListaProfessores')} color={colors.accent} icon="people-circle-outline" />
              <View style={{ height: 12 }} />
              <CustomButton title="Lista de Disciplinas" onPress={() => navigation.navigate('ListaDisciplinas')} color={colors.warning} icon="list-outline" />

              <Text style={globalStyles.sectionLabel}>🎓 Acadêmico</Text>
              <CustomButton title="Consulta de Boletim" onPress={() => navigation.navigate('Boletim')} color={colors.primaryDark} icon="document-text-outline" />
            </>
          )}

          {/* === PROFESSOR === */}
          {perfil === 'professor' && (
            <>
              {stats && (
                <View style={styles.grid}>
                  <KpiCard icon="library" value={stats.disciplinas} label="Minhas Turmas" color={colors.warning} />
                  <KpiCard icon="people" value={stats.alunos} label="Meus Alunos" color={colors.primary} />
                </View>
              )}

              <Text style={globalStyles.sectionLabel}>📋 Gestão</Text>
              <View style={styles.grid}>
                <MenuCard icon="people" color={colors.primary} title="Meus Alunos" onPress={() => navigation.navigate('ListaAlunos')} />
                <MenuCard icon="library" color={colors.warning} title="Disciplinas" onPress={() => navigation.navigate('ListaDisciplinas')} />
              </View>

              <Text style={globalStyles.sectionLabel}>🎓 Acadêmico</Text>
              <View style={styles.grid}>
                <MenuCard icon="create" color={colors.success} title="Lançar Notas" onPress={() => navigation.navigate('LancarNotas')} />
                <MenuCard icon="document-text" color={colors.primaryDark} title="Boletim" onPress={() => navigation.navigate('Boletim')} />
              </View>
            </>
          )}

          {/* === ALUNO === */}
          {perfil === 'aluno' && (
            <>
              {stats && (
                <SafeBlurView intensity={70} tint="light" style={styles.performanceCard}>
                  <View style={styles.perfHeader}>
                    <Ionicons name="trophy" size={32} color="#F59E0B" />
                    <View style={{ marginLeft: 16, flex: 1 }}>
                      <Text style={styles.perfTitle}>Seu Desempenho</Text>
                      <Text style={styles.perfDesc}>Média baseada em {stats.totalDisciplinas} disciplinas</Text>
                    </View>
                  </View>
                  <Text style={styles.perfGrade}>{stats.media > 0 ? stats.media : '--'}</Text>
                </SafeBlurView>
              )}
              
              <Text style={globalStyles.sectionLabel}>📋 Mural de Avisos</Text>
              <SafeBlurView intensity={70} tint="light" style={styles.feedCard}>
                <Ionicons name="megaphone" size={24} color={colors.primary} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.feedTitle}>Secretaria Acadêmica</Text>
                  <Text style={styles.feedText}>O prazo para trancamento de matrícula se encerra na próxima sexta-feira. Fique atento!</Text>
                </View>
              </SafeBlurView>
              
              <View style={{ height: 16 }} />
              
              <Text style={globalStyles.sectionLabel}>🚀 Atalhos</Text>
              <MenuCard icon="document-text" color={colors.primaryDark} title="Meu Boletim" onPress={() => navigation.navigate('Boletim')} full />
            </>
          )}

        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </GlassBackground>
  );
}

// Componente de mini-card para KPI
function KpiCard({ icon, value, label, color }) {
  return (
    <SafeBlurView intensity={70} tint="light" style={[styles.menuCardBox, { flex: 1, minHeight: 90, padding: 14, alignItems: 'flex-start' }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, width: '100%' }}>
        <View style={[styles.menuIconWrapper, { backgroundColor: color + '20', width: 36, height: 36, marginBottom: 0, marginRight: 10 }]}>
           <Ionicons name={icon} size={20} color={color} />
        </View>
        <Text style={{ fontFamily: fonts.extraBold, fontSize: 26, color: colors.text }}>{value}</Text>
      </View>
      <Text style={{ fontFamily: fonts.semiBold, fontSize: 13, color: colors.textLight }}>{label}</Text>
    </SafeBlurView>
  );
}

// Componente de card de menu responsivo (quadrado vertical para grids)
function MenuCard({ icon, color, title, onPress, full }) {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, { toValue: 0.94, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleValue, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[{ flex: full ? undefined : 1, width: full ? '100%' : undefined, transform: [{ scale: scaleValue }] }]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <SafeBlurView intensity={70} tint="light" style={styles.menuCardBox}>
          <View style={[styles.menuIconWrapper, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={28} color={color} />
          </View>
          <Text style={styles.menuCardText} numberOfLines={2}>{title}</Text>
        </SafeBlurView>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderRadius: 30,
    padding: 24,
    marginTop: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.textLight,
  },
  userName: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(251, 113, 133, 0.2)', // dangerLight transparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 18,
    gap: 6,
  },
  badgeText: {
    fontSize: 14,
    fontFamily: fonts.bold,
  },
  menuContainer: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  menuCardBox: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    overflow: 'hidden',
  },
  menuIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuCardText: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  performanceCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  perfHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  perfTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.text,
  },
  perfDesc: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
  perfGrade: {
    fontFamily: fonts.extraBold,
    fontSize: 36,
    color: '#059669',
  },
  feedCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  feedTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  feedText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
  },
});
