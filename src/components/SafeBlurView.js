import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function SafeBlurView({ style, children, intensity, tint, ...rest }) {
  if (Platform.OS === 'android') {
    // No Android, o BlurView causa memory leaks e crashes pesados com ScrollViews/Keyboards.
    // Usamos uma View translúcida simples que simula o efeito Glassmorphism sem o peso nativo.
    const isDark = tint === 'dark';
    return (
      <View 
        style={[
          style, 
          { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.65)' }
        ]}
        {...rest}
      >
        {children}
      </View>
    );
  }
  
  // No iOS funciona perfeitamente
  return (
    <BlurView intensity={intensity || 70} tint={tint || "light"} style={style} {...rest}>
      {children}
    </BlurView>
  );
}
