import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function LoginScreen({ navigation }) {
  const [emailOuCodigo, setEmailOuCodigo] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!emailOuCodigo.trim() || !palavraPasse.trim()) {
      Alert.alert('Campos Obrigatórios', 'Por favor, introduza o e-mail/código institucional e a palavra-passe.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/auth/login', {
        email: emailOuCodigo.trim(),
        codigo_institucional: emailOuCodigo.trim(),
        palavra_passe: palavraPasse,
      });

      const { token, utilizador } = response.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('utilizador', JSON.stringify(utilizador));

      navigation.replace('MainTabs');
    } catch (error) {
      console.error(error);
      const mensagemErro = error.response?.data?.erro || 'Não foi possível conectar ao servidor. Verifique a sua ligação.';
      Alert.alert('Erro de Acesso', mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Logótipo UniPúnguè */}
        <View style={styles.header}>
          <Image
            source={require('../assets/unipungue.webp')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>Acesse sua conta</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* E-mail Institucional */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail institucional</Text>
            <TextInput
              style={styles.input}
              placeholder="aluno@unipungue.ac.mz"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailOuCodigo}
              onChangeText={setEmailOuCodigo}
            />
          </View>

          {/* Palavra-passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Palavra-passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!mostrarSenha}
                value={palavraPasse}
                onChangeText={setPalavraPasse}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenha(!mostrarSenha)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => Alert.alert('Recuperação', 'Contacte o suporte da biblioteca para redefinir a sua palavra-passe.')}
              style={styles.forgotPasswordButton}
            >
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Entrar */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>ENTRAR</Text>
            )}
          </TouchableOpacity>

          {/* Footer para Registo */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
              <Text style={styles.registerLink}>Registe-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeButton: {
    paddingHorizontal: 14,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  registerLink: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});