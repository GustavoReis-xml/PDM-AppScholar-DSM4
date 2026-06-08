import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the local network IP so physical devices scanning the Expo QR Code can connect
const IP = '192.168.100.8';
export const BASE_URL = `http://${IP}:3000/api`;

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const token = await AsyncStorage.getItem('@token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro na requisição');
  }

  return data;
};
