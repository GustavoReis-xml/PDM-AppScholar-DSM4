import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Hook customizado para acesso rápido aos dados de autenticação
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}
