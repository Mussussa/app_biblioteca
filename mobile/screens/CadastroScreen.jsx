import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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

export default function CadastroScreen({ navigation }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [codigoInstitucional, setCodigoInstitucional] = useState('');
  const [palavraPasse, setPalavraPasse] = useState('');
  const [confirmarPalavraPasse, setConfirmarPalavraPasse] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRegisto() {
    // Validações locais
    if (!nomeCompleto.trim() || !email.trim() || !codigoInstitucional.trim() || !palavraPasse || !confirmarPalavraPasse) {
      Alert.alert('Campos Incompletos', 'Por favor, preencha todos os campos do formulário.');
      return;
    }

    if (palavraPasse !== confirmarPalavraPasse) {
      Alert.alert('Erro de Senha', 'A palavra-passe e a confirmação não coincidem.');
      return;
    }

    if (!aceitouTermos) {
      Alert.alert('Termos de Uso', 'É necessário aceitar os Termos de Uso e a Política de Privacidade para prosseguir.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/api/auth/registar', {
        nome_completo: nomeCompleto.trim(),
        email: email.trim().toLowerCase(),
        codigo_institucional: codigoInstitucional.trim(),
        palavra_passe: palavraPasse,
      });

const { utilizador } = response.data;

      // Tratamento compatível com Web e Mobile para redirecionamento pós-registo
      if (Platform.OS === 'web') {
        const confirmar = window.confirm(`Conta Criada!\n\nBem-vindo(a), ${utilizador.nome}! O seu registo foi concluído com sucesso.\n\nDeseja ir para o Login?`);
        if (confirmar) {
          navigation.navigate('Login'); // Ou navigation.goBack() se preferir voltar à anterior
        }
      } else {
        Alert.alert(
          'Conta Criada!',
          `Bem-vindo(a), ${utilizador.nome}! O seu registo foi concluído com sucesso.`,
          [
            {
              text: 'Ir para Login',
              onPress: () => navigation.navigate('Login'), // Altere para navigation.goBack() se quiser voltar para trás
            },
          ]
        );
      }
      
    } catch (error) {
      console.error(error);
      const mensagemErro = error.response?.data?.erro || 'Ocorreu um erro ao criar a conta. Tente novamente.';
      Alert.alert('Erro no Registo', mensagemErro);
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
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Preencha seus dados</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Nome Completo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu nome"
              placeholderTextColor="#94a3b8"
              value={nomeCompleto}
              onChangeText={setNomeCompleto}
            />
          </View>

          {/* E-mail Institucional */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail institucional</Text>
            <TextInput
              style={styles.input}
              placeholder="seuemail@unipungue.ac.mz"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Código Institucional / Estudante */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Código Institucional / Telefone</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 2025/00123"
              placeholderTextColor="#94a3b8"
              value={codigoInstitucional}
              onChangeText={setCodigoInstitucional}
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
          </View>

          {/* Confirmar Palavra-passe */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirmar palavra-passe</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!mostrarConfirmarSenha}
                value={confirmarPalavraPasse}
                onChangeText={setConfirmarPalavraPasse}
              />
              <TouchableOpacity
                onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={mostrarConfirmarSenha ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Termos de Aceitação */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAceitouTermos(!aceitouTermos)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, aceitouTermos && styles.checkboxSelected]}>
              {aceitouTermos && <Ionicons name="checkmark" size={14} color="#ffffff" />}
            </View>
            <Text style={styles.termsText}>
              Li e aceito os <Text style={styles.termsLink}>Termos de Uso</Text> e a <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>
          </TouchableOpacity>

          {/* Botão de Submissão */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleRegisto}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>REGISTAR</Text>
            )}
          </TouchableOpacity>

          {/* Link para Voltar ao Login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Entrar</Text>
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
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
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
    marginBottom: 16,
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
    paddingVertical: 11,
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
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeButton: {
    paddingHorizontal: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  termsLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
    elevation: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
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
    marginTop: 24,
  },
  footerText: {
    fontSize: 13,
    color: '#64748b',
  },
  loginLink: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});