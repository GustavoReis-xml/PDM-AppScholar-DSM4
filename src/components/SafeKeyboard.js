import React from 'react';
import { KeyboardAvoidingView, View, Platform } from 'react-native';

export default function SafeKeyboard({ children, style, ...rest }) {
  if (Platform.OS === 'android') {
    // No Android (especialmente com expo edgeToEdge), o KeyboardAvoidingView levanta exceções nativas
    // ao dispensar o teclado. Renderizar apenas uma View evita que o Listener nativo de teclado seja ativado,
    // eliminando o crash completamente.
    return <View style={style}>{children}</View>;
  }
  
  // No iOS ele é seguro e necessário
  return (
    <KeyboardAvoidingView style={style} behavior="padding" {...rest}>
      {children}
    </KeyboardAvoidingView>
  );
}
