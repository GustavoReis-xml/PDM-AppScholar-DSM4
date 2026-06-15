import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function GlassBackground({ children }) {
  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={['#E9D5FF', '#BFDBFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Elementos Decorativos "Blobs" */}
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      <View style={[styles.blob, styles.blob3]} />

      {/* Conteúdo Seguro por cima de tudo */}
      <View style={StyleSheet.absoluteFillObject}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.4,
  },
  blob1: {
    width: 300,
    height: 300,
    backgroundColor: '#8B5CF6',
    top: -100,
    right: -100,
    transform: [{ scale: 1.2 }],
  },
  blob2: {
    width: 250,
    height: 250,
    backgroundColor: '#34D399',
    bottom: -50,
    left: -100,
  },
  blob3: {
    width: 200,
    height: 200,
    backgroundColor: '#0EA5E9',
    top: '40%',
    right: -50,
    opacity: 0.2,
  }
});
