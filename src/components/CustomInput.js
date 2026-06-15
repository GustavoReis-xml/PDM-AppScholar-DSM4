import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../styles/globalStyles';

export default function CustomInput({ label, placeholder, value, onChangeText, secureTextEntry, icon, style, ...rest }) {
  const [isFocused, setIsFocused] = useState(false);

  // Calcula cores dinâmicas para foco.
  // Evitamos usar camadas "absoluteFillObject" que esgotam a memória gráfica do Android.
  const containerBgColor = isFocused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)';
  const containerBorderColor = isFocused ? colors.primary : colors.glassBorder;

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, { backgroundColor: containerBgColor, borderColor: containerBorderColor }]}>
        
        {icon && (
          <View style={[styles.iconContainer, isFocused && styles.iconFocused]}>
            <Ionicons name={icon} size={18} color={isFocused ? colors.primary : colors.textMuted} />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            Platform.OS === 'web' && { outlineStyle: 'none' }
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value != null ? String(value) : ''}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
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
    fontSize: 13,
    color: colors.textLight,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 58,
    // Removido 'overflow: hidden' para evitar sobrecarga de GPU no Android
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconFocused: {
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontFamily: fonts.semiBold,
    // Definimos altura fixa para garantir que TextInput nativo do Android e Web renderizem igualmente
    height: Platform.OS === 'web' ? '100%' : 58,
    paddingVertical: Platform.OS === 'android' ? 0 : 16, // Corrige alinhamento do texto no Android
  },
});