import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Image,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const FILTROS = [
  { id: 'todos', label: 'Todos' },
  { id: 'Físico', label: 'Físicos' }, // Alterado para corresponder ao ENUM 'Físico'
  { id: 'PDF', label: 'Digitais/PDF' },
  { id: 'TCC', label: 'TCCs' }
];

export default function CatalogoScreen({ navigation, route }) {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState(route.params?.filtro || 'todos');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarObras();
  }, [filtroAtivo]);

  async function carregarObras(termoPesquisa = busca) {
    try {
      setLoading(true);
      let endpoint = `/api/public/obras?`;
      
      if (filtroAtivo !== 'todos') {
        endpoint += `tipo_recurso=${filtroAtivo}&`;
      }
      if (termoPesquisa) {
        endpoint += `q=${encodeURIComponent(termoPesquisa)}`;
      }

      console.log(`[Catalogo] 🔍 A pesquisar obras: ${endpoint}`);
      const response = await api.get(endpoint);

      const lista = response.data?.obras || response.data || [];
      setObras(Array.isArray(lista) ? lista : []);
    } catch (error) {
      console.error('[Catalogo] ❌ Erro ao carregar catálogo:', error.message);
      setObras([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchSubmit() {
    carregarObras(busca);
  }

  const renderBookItem = ({ item }) => {
    const tipo = (item.tipo_recurso || '').toUpperCase();
    const isDigital = tipo === 'PDF' || tipo === 'DIGITAL' || tipo === 'EPUB';
    const isDisponivel = item.quantidade_disponivel > 0 || isDigital;

    return (
      <TouchableOpacity
        style={styles.bookCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('DetalhesObra', { obraId: item.id, obra: item })}
      >
        <View style={styles.coverContainer}>
          {item.capa_url ? (
            <Image
              source={{ uri: item.capa_url }}
              style={styles.bookCoverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons
                name={isDigital ? 'document-text-outline' : 'book-outline'}
                size={32}
                color="#1e3a8a"
              />
            </View>
          )}
        </View>

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{item.titulo || 'Nenhum'}</Text>
          <Text style={styles.bookAuthor}>{item.autor || 'Nenhum'}</Text>
          <Text style={styles.bookMeta}>
            {item.ano_publicacao || 'Nenhum'} • {tipo || 'Físico'}
          </Text>

          <View style={[
            styles.statusBadge,
            { backgroundColor: isDisponivel ? '#dcfce7' : '#fee2e2' }
          ]}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isDisponivel ? '#16a34a' : '#dc2626' }
            ]} />
            <Text style={[
              styles.statusText,
              { color: isDisponivel ? '#15803d' : '#b91c1c' }
            ]}>
              {isDisponivel ? 'Disponível' : 'Indisponível'}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color="#cbd5e1" style={{ alignSelf: 'center' }} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* Header Azul */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catálogo</Text>

        {/* Input Pesquisa */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar por título, autor ou ISBN..."
            placeholderTextColor="#94a3b8"
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => { setBusca(''); carregarObras(''); }}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTROS.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[
                styles.chip,
                filtroAtivo === f.id && styles.chipActive
              ]}
              onPress={() => setFiltroAtivo(f.id)}
            >
              <Text style={[
                styles.chipText,
                filtroAtivo === f.id && styles.chipTextActive
              ]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Obras */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1e3a8a" />
        </View>
      ) : (
        <FlatList
          data={obras}
          keyExtractor={(item, index) => String(item.id || index)}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Ionicons name="journal-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyTitle}>Nenhuma obra encontrada</Text>
              <Text style={styles.emptySub}>Tente alterar o filtro ou termo de pesquisa.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', marginBottom: 12 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  filtersRow: { gap: 8, marginTop: 14, paddingRight: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: { backgroundColor: '#ffffff' },
  chipText: { fontSize: 12, color: '#bfdbfe', fontWeight: '500' },
  chipTextActive: { color: '#1e3a8a', fontWeight: 'bold' },
  listContent: { padding: 16, gap: 12 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  coverContainer: {
    width: 65,
    height: 85,
    borderRadius: 6,
    backgroundColor: '#eff6ff',
    overflow: 'hidden',
    marginRight: 12,
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookCoverImage: {
    width: '100%',
    height: '100%',
  },
  bookInfo: { flex: 1, justifyContent: 'center' },
  bookTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  bookAuthor: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  bookMeta: { fontSize: 11, color: '#94a3b8', marginBottom: 6 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '600' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#334155', marginTop: 12 },
  emptySub: { fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 4 },
});