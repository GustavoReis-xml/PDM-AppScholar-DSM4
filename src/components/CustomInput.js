import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones nativos do Expo
import { colors } from '../styles/globalStyles';

export default function CustomInput({ label, placeholder, value, onChangeText, secureTextEntry, icon }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputContainer, 
        isFocused && styles.inputFocused // Muda a borda quando clicado
      ]}>
        {icon && <Ionicons name={icon} size={20} color={isFocused ? colors.primary : colors.textLight} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56, // Altura padrão de apps modernos
  },
  inputFocused: {
    borderColor: colors.secondary,
    backgroundColor: '#F0F9FF', // Azul bem clarinho no fundo ao focar
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: '100%',
  },
});