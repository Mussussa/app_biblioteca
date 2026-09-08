import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Image,
  Platform,
  Keyboard
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Bookmark,
  LogOut,
  GraduationCap,
  Building2,
  RefreshCw
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export function PerfilScreen({ navigation }) {
  const [perfil, setPerfil] = useState(null);
  const [emprestimos, setEmprestimos] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState('emprestimos'); // 'emprestimos' ou 'reservas'

  const handleNavegacaoSegura = (callback) => {
    if (Platform.OS === 'web') {
      Keyboard.dismiss();
      if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
    }
    if (callback) callback();
  };

  const carregarDadosPerfil = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Sessão Expirada', 'Por favor, faça login novamente.', [
          { text: 'Login', onPress: () => handleNavegacaoSegura(() => navigation.navigate('Login')) }
        ]);
        return;
      }

      // Requisições paralelas para otimizar o carregamento
      const [resPerfil, resEmprestimos, resReservas] = await Promise.all([
        api.get('/api/perfil'),
        api.get('/api/perfil/emprestimos'),
        api.get('/api/perfil/reservas')
      ]);

      setPerfil(resPerfil.data);
      setEmprestimos(resEmprestimos.data);
      setReservas(resReservas.data);
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      if (error.response?.status === 401) {
        Alert.alert('Sessão Expirada', 'A sua sessão expirou. Faça login novamente.', [
          { text: 'Login', onPress: () => handleNavegacaoSegura(() => navigation.navigate('Login')) }
        ]);
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as informações do perfil.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    carregarDadosPerfil();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarDadosPerfil();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Terminar Sessão',
      'Tem certeza de que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            handleNavegacaoSegura(() => navigation.navigate('Login'));
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>A carregar o seu perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Fixo do Perfil */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>15. Menu do Perfil</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />
        }
      >
        {/* Cartão de Informações Pessoais */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            {perfil?.foto_url ? (
              <Image source={{ uri: perfil.foto_url }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={36} color="#2563eb" />
              </View>
            )}
            <View style={styles.badgePerfil}>
              <Text style={styles.badgeText}>{perfil?.perfil?.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.nomeUtilizador}>{perfil?.nome_completo || 'Utilizador'}</Text>
          
          <View style={styles.infoRow}>
            <Mail size={15} color="#64748b" />
            <Text style={styles.infoText}>{perfil?.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Phone size={15} color="#64748b" />
            <Text style={styles.infoText}>{perfil?.telefone || 'Telefone não registado'}</Text>
          </View>

          {perfil?.Curso && (
            <View style={styles.academicInfo}>
              <View style={styles.infoRow}>
                <GraduationCap size={15} color="#2563eb" />
                <Text style={styles.academicText}>Curso: {perfil.Curso.nome}</Text>
              </View>
              {perfil.Curso.Faculdade && (
                <View style={styles.infoRow}>
                  <Building2 size={15} color="#2563eb" />
                  <Text style={styles.academicText}>Faculdade: {perfil.Curso.Faculdade.nome}</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Seletor de Abas (Empréstimos vs Reservas) */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'emprestimos' && styles.tabButtonActive]}
            onPress={() => setAbaAtiva('emprestimos')}
          >
            <BookOpen size={16} color={abaAtiva === 'emprestimos' ? '#2563eb' : '#64748b'} />
            <Text style={[styles.tabText, abaAtiva === 'emprestimos' && styles.tabTextActive]}>
              Meus Empréstimos ({emprestimos.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, abaAtiva === 'reservas' && styles.tabButtonActive]}
            onPress={() => setAbaAtiva('reservas')}
          >
            <Bookmark size={16} color={abaAtiva === 'reservas' ? '#2563eb' : '#64748b'} />
            <Text style={[styles.tabText, abaAtiva === 'reservas' && styles.tabTextActive]}>
              Minhas Reservas ({reservas.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Listagem Dinâmica baseada na aba ativa */}
        {abaAtiva === 'emprestimos' ? (
          <View style={styles.listSection}>
            {emprestimos.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Não possui empréstimos registados.</Text>
              </View>
            ) : (
              emprestimos.map((item) => (
                <View key={item.id} style={styles.cardItem}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>
                      {item.ExemplarFisico?.Obra?.titulo || 'Obra Desconhecida'}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.estado === 'ativo'
                              ? '#dbeafe'
                              : item.estado === 'atrasado'
                              ? '#fee2e2'
                              : '#f1f5f9'
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.estado === 'ativo'
                                ? '#1d4ed8'
                                : item.estado === 'atrasado'
                                ? '#b91c1c'
                                : '#475569'
                          }
                        ]}
                      >
                        {item.estado.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubText}>
                    Exemplar Cód: {item.ExemplarFisico?.codigo_exemplar || 'N/A'}
                  </Text>
                  <Text style={styles.cardDateText}>
                    Limite Devolução: {new Date(item.data_limite_devolucao).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        ) : (
          <View style={styles.listSection}>
            {reservas.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyText}>Não possui reservas ativas ou históricas.</Text>
              </View>
            ) : (
              reservas.map((item) => (
                <View key={item.id} style={styles.cardItem}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardTitle}>{item.Obra?.titulo || 'Obra Reservada'}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            item.estado === 'pendente'
                              ? '#fef3c7'
                              : item.estado === 'pronto_levantamento'
                              ? '#d1fae5'
                              : '#f1f5f9'
                        }
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              item.estado === 'pendente'
                                ? '#b45309'
                                : item.estado === 'pronto_levantamento'
                                ? '#065f46'
                                : '#475569'
                          }
                        ]}
                      >
                        {item.estado.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardSubText}>Código de Reserva: {item.codigo_reserva}</Text>
                  <Text style={styles.cardDateText}>
                    Data: {new Date(item.data_reserva).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loadingText: { marginTop: 10, color: '#64748b', fontSize: 14 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e3a8a' },
  logoutButton: { padding: 6 },
  scrollContent: { padding: 16 },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
    elevation: 1
  },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bfdbfe'
  },
  badgePerfil: {
    position: 'absolute',
    bottom: -4,
    right: -10,
    backgroundColor: '#2563eb',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10
  },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold' },
  nomeUtilizador: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, textAlign: 'center' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  infoText: { fontSize: 13, color: '#64748b' },
  academicInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    width: '100%',
    alignItems: 'flex-start',
    gap: 4
  },
  academicText: { fontSize: 13, color: '#334155', fontWeight: '500' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 8, padding: 4, marginBottom: 16 },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6
  },
  tabButtonActive: { backgroundColor: '#ffffff', elevation: 1 },
  tabText: { fontSize: 12, fontWeight: '500', color: '#64748b' },
  tabTextActive: { color: '#2563eb', fontWeight: 'bold' },
  listSection: { gap: 10 },
  emptyCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  emptyText: { color: '#64748b', fontSize: 13 },
  cardItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8
  },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: 'bold' },
  cardSubText: { fontSize: 13, color: '#475569', marginBottom: 2 },
  cardDateText: { fontSize: 12, color: '#64748b' }
});