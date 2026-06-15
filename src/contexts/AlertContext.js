import React, { createContext, useState, useCallback, useContext } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AlertContext = createContext({});

// Detecta o tipo de alerta pelo título para escolher ícone/cor automaticamente
function getAlertStyle(title) {
  const t = (title || '').toLowerCase();
  if (t.includes('sucesso') || t.includes('success')) {
    return { icon: 'checkmark-circle', color: '#059669', bg: 'rgba(52, 211, 153, 0.12)', borderColor: 'rgba(52, 211, 153, 0.3)' };
  }
  if (t.includes('erro') || t.includes('error') || t.includes('falha')) {
    return { icon: 'close-circle', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)' };
  }
  if (t.includes('excluir') || t.includes('deletar') || t.includes('sair')) {
    return { icon: 'warning', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' };
  }
  if (t.includes('aviso') || t.includes('atenção') || t.includes('campo') || t.includes('inválid')) {
    return { icon: 'alert-circle', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.3)' };
  }
  // Default (info)
  return { icon: 'information-circle', color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.12)', borderColor: 'rgba(139, 92, 246, 0.3)' };
}

export function AlertProvider({ children }) {
  const [visible, setVisible] = useState(false);
  const [alertData, setAlertData] = useState({ title: '', message: '', buttons: [] });
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.85)).current;

  const showAlert = useCallback((title, message, buttons) => {
    // Se não tem botões, cria um "OK" padrão
    const btns = buttons && buttons.length > 0 
      ? buttons 
      : [{ text: 'OK' }];
    
    setAlertData({ title, message, buttons: btns });
    setVisible(true);
    
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 65, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const hideAlert = useCallback((callback) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setVisible(false);
      if (callback) callback();
    });
  }, [fadeAnim, scaleAnim]);

  const handleButtonPress = (button) => {
    hideAlert(() => {
      if (button.onPress) button.onPress();
    });
  };

  const alertStyle = getAlertStyle(alertData.title);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        transparent
        visible={visible}
        animationType="none"
        statusBarTranslucent
        onRequestClose={() => hideAlert()}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.overlayTouch} activeOpacity={1} onPress={() => {
            // Fecha se clicar fora (apenas se tiver um botão só)
            if (alertData.buttons.length <= 1) hideAlert();
          }}>
            <Animated.View 
              style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
              // Impede que clique no card feche o overlay
              onStartShouldSetResponder={() => true}
            >
              {/* Ícone */}
              <View style={[styles.iconWrapper, { backgroundColor: alertStyle.bg, borderColor: alertStyle.borderColor }]}>
                <Ionicons name={alertStyle.icon} size={36} color={alertStyle.color} />
              </View>

              {/* Título */}
              <Text style={styles.title}>{alertData.title}</Text>

              {/* Mensagem */}
              <Text style={styles.message}>{alertData.message}</Text>

              {/* Botões */}
              <View style={styles.buttonRow}>
                {alertData.buttons.map((btn, index) => {
                  const isDestructive = btn.style === 'destructive';
                  const isCancel = btn.style === 'cancel';
                  const isPrimary = !isDestructive && !isCancel && index === alertData.buttons.length - 1;

                  let btnStyle = styles.btnDefault;
                  let txtStyle = styles.btnTextDefault;

                  if (isDestructive) {
                    btnStyle = styles.btnDestructive;
                    txtStyle = styles.btnTextDestructive;
                  } else if (isCancel) {
                    btnStyle = styles.btnCancel;
                    txtStyle = styles.btnTextCancel;
                  } else if (isPrimary || alertData.buttons.length === 1) {
                    btnStyle = styles.btnPrimary;
                    txtStyle = styles.btnTextPrimary;
                  }

                  return (
                    <TouchableOpacity
                      key={index}
                      style={[styles.btn, btnStyle, alertData.buttons.length === 1 && { flex: 1 }]}
                      onPress={() => handleButtonPress(btn)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.btnText, txtStyle]}>{btn.text}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context || !context.showAlert) {
    // Fallback para Alert.alert nativo se o contexto não existir
    return { showAlert: (title, msg, btns) => {
      const { Alert } = require('react-native');
      Alert.alert(title, msg, btns);
    }};
  }
  return context;
}

export default AlertContext;

const { width } = Dimensions.get('window');
const cardWidth = Math.min(width - 48, 380);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouch: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    // Sombra premium
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito_800ExtraBold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  message: {
    fontSize: 15,
    fontFamily: 'Nunito_400Regular',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },

  // Botão primário (roxo)
  btnPrimary: {
    backgroundColor: '#8B5CF6',
  },
  btnTextPrimary: {
    color: '#FFFFFF',
  },

  // Botão default (quando há múltiplos e não é o principal)
  btnDefault: {
    backgroundColor: '#F1F5F9',
  },
  btnTextDefault: {
    color: '#475569',
  },

  // Botão cancelar
  btnCancel: {
    backgroundColor: '#F1F5F9',
  },
  btnTextCancel: {
    color: '#64748B',
  },

  // Botão destrutivo (excluir)
  btnDestructive: {
    backgroundColor: '#FEE2E2',
  },
  btnTextDestructive: {
    color: '#DC2626',
  },
});
