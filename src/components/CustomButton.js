import React, { useRef } from 'react';
import { Text, StyleSheet, Animated, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function CustomButton({ title, onPress, color, icon, variant = 'solid', style }) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleValue, {
      toValue: 0.94,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // Cores do gradiente
  let gradColors = ['#8B5CF6', '#6D28D9']; // Padrão roxo
  if (color === colors.success || color === '#059669') gradColors = ['#34D399', '#059669'];
  else if (color === colors.accent || color === '#0891B2') gradColors = ['#0EA5E9', '#0284C7'];
  else if (color === colors.warning || color === '#D97706') gradColors = ['#FBBF24', '#D97706'];
  else if (color === colors.danger) gradColors = ['#FB7185', '#E11D48'];

  if (variant === 'outline') {
    return (
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <Pressable
          style={[styles.buttonOutline, { borderColor: color || colors.primary }, style]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          {icon && <Ionicons name={icon} size={20} color={color || colors.primary} style={styles.icon} />}
          <Text style={[styles.textOutline, { color: color || colors.primary }]}>{title}</Text>
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], ...styles.shadowContainer }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={gradColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.button, style]}
        >
          {icon && <Ionicons name={icon} size={20} color={colors.white} style={styles.icon} />}
          <Text style={styles.text}>{title}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  buttonOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  icon: {
    marginRight: 10,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.extraBold,
    letterSpacing: 0.5,
  },
  textOutline: {
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: 0.3,
  },
});