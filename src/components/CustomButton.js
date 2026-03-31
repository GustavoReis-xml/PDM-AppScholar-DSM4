import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CustomButton({ title, onPress, color = colors.primary, icon }) {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: color }, globalStyles.shadow]} 
      onPress={onPress}
      activeOpacity={0.8} // Efeito suave ao clicar
    >
      <View style={styles.content}>
        {icon && <Ionicons name={icon} size={22} color="#fff" style={styles.icon} />}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});