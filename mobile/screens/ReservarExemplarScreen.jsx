import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Keyboard,
  Platform
} from 'react-native';
import { BookOpen, CheckCircle, ArrowLeft, BookmarkCheck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export default function ReservarExemplarScreen({ route, navigation }) {
  const { obra } = route.params || {};
  const exemplares = obra?.ExemplarFisicos || [];

  const [selectedExemplar, setSelectedExemplar] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filtra apenas os exemplares com estado "disponivel"
  const exemplaresDisponiveis = exemplares.filter(
    (e) => e.estado === 'disponivel'
  );

  // Função auxiliar para limpar foco na Web antes de navegar
  const handleNavegacaoSegura = (callback) => {
    if (Platform.OS === 'web') {
      Keyboard.dismiss();
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    }
    if (callback) callback();
  };

const handleConfirmarReserva = async () => {
    if (!selectedExemplar) {
      Alert.alert('Atenção', 'Selecione um exemplar disponível para reservar.');
      return;
    }

    try {
      setLoading(true);

      // 1. VERIFICAR SE O UTILIZADOR ESTÁ LOGADO
      const token = await AsyncStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        Alert.alert(
          'Autenticação Necessária',
          'Precisa de iniciar sessão na sua conta para poder reservar um exemplar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { 
              text: 'Fazer Login', 
              onPress: () => handleNavegacaoSegura(() => navigation.navigate('Login'))
            }
          ]
        );
        return;
      }

      // 2. SE ESTIVER LOGADO, FAZ A CHAMADA PARA A API PASSANDO O TOKEN NO HEADER
      const response = await api.post(
        '/api/public/reservas', 
        {
          obra_id: obra.id,
          exemplar_id: selectedExemplar.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Sucesso!', response.data?.mensagem || 'Reserva efetuada com sucesso!', [
        {
          text: 'OK',
          onPress: () => handleNavegacaoSegura(() => navigation.navigate('MainTabs')),
        },
      ]);
    } catch (error) {
      console.error('Erro ao efetuar reserva:', error);
      
      if (error.response?.status === 401) {
        Alert.alert(
          'Sessão Expirada', 
          'A sua sessão expirou. Por favor, faça login novamente.',
          [{ text: 'Fazer Login', onPress: () => handleNavegacaoSegura(() => navigation.navigate('Login')) }]
        );
      } else {
        const msgErro = error.response?.data?.erro || 'Não foi possível processar a reserva.';
        Alert.alert('Erro na Reserva', msgErro);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header com botão de voltar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => handleNavegacaoSegura(() => navigation.goBack())}
        >
          <ArrowLeft size={20} color="#1e3a8a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservar Exemplar</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Resumo da Obra */}
        <View style={styles.obraCard}>
          <BookOpen size={28} color="#2563eb" style={{ marginBottom: 8 }} />
          <Text style={styles.tituloObra}>{obra?.titulo || 'Título Indisponível'}</Text>
          <Text style={styles.autorObra}>Autor: {obra?.autor || 'Desconhecido'}</Text>
          {obra?.Categorium && (
            <Text style={styles.categoriaObra}>
              Categoria: {obra.Categorium.nome}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Selecione um Exemplar Disponível:</Text>

        {exemplaresDisponiveis.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Não existem exemplares físicos disponíveis para empréstimo/reserva neste momento.
            </Text>
          </View>
        ) : (
          <FlatList
            data={exemplaresDisponiveis}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            renderItem={({ item }) => {
              const isSelected = selectedExemplar?.id === item.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.exemplarCard,
                    isSelected && styles.exemplarCardSelected,
                  ]}
                  onPress={() => setSelectedExemplar(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.exemplarInfo}>
                    <Text style={styles.codigoExemplar}>
                      Código: {item.codigo_exemplar}
                    </Text>
                    <Text style={styles.localizacao}>
                      Prateleira: {item.localizacao_prateleira || 'N/A'}
                    </Text>
                  </View>
                  {isSelected && (
                    <CheckCircle size={22} color="#2563eb" />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </ScrollView>

      {/* Botão de Confirmação no Rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedExemplar || loading) && styles.disabledButton,
          ]}
          onPress={handleConfirmarReserva}
          disabled={!selectedExemplar || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <BookmarkCheck size={18} color="#ffffff" />
              <Text style={styles.confirmText}>Confirmar Pedido de Reserva</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 12,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  scrollContent: { padding: 16 },
  obraCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 1,
  },
  tituloObra: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  autorObra: { fontSize: 13, color: '#64748b', marginBottom: 2 },
  categoriaObra: { fontSize: 12, color: '#2563eb', fontWeight: '500' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 12 },
  exemplarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginBottom: 10,
  },
  exemplarCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
    borderWidth: 2,
  },
  exemplarInfo: { flex: 1 },
  codigoExemplar: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  localizacao: { fontSize: 12, color: '#64748b', marginTop: 2 },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emptyText: { fontSize: 13, color: '#64748b', textAlign: 'center' },
  footer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  confirmButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  disabledButton: { backgroundColor: '#94a3b8' },
  confirmText: { color: '#ffffff', fontWeight: 'bold', fontSize: 15 },
});