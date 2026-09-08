import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator, 
  Linking 
} from 'react-native';
import { Search, FileText, Download, GraduationCap } from 'lucide-react-native';
import api from '../services/api'; 

export function TrabalhosScreen() {
  const [trabalhos, setTrabalhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function fetchTrabalhos(query = '', pagina = 1) {
    try {
      setLoading(true);
      // Corrigido para incluir o prefixo correto da rota pública
      const response = await api.get(`/api/public/trabalhos`, {
        params: { q: query, page: pagina, limit: 10 }
      });
      
      setTrabalhos(response.data.trabalhos);
      setTotalPages(response.data.total_paginas);
    } catch (error) {
      console.error('Erro ao carregar trabalhos académicos:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrabalhos(searchQuery, page);
  }, [page]);

  const handleSearch = () => {
    setPage(1);
    fetchTrabalhos(searchQuery, 1);
  };

  const abrirFicheiro = async (url) => {
    if (!url) {
      alert('Este trabalho não possui ficheiro digital associado.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Não foi possível abrir o link do ficheiro.');
      }
    } catch (error) {
      console.error('Erro ao abrir o ficheiro:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <GraduationCap size={20} color="#2563eb" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.titulo} numberOfLines={2}>{item.titulo}</Text>
          <Text style={styles.autor}>Autor: {item.autor_estudante}</Text>
        </View>
      </View>

      {item.resumo && (
        <Text style={styles.resumo} numberOfLines={3}>{item.resumo}</Text>
      )}

      {/* Corrigido de <div> para <View> e alterado para item.pdf_url */}
      <View style={styles.cardFooter}>
        <Text style={styles.data}>
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
        </Text>
        
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={() => abrirFicheiro(item.pdf_url)}
        >
          <Download size={14} color="#ffffff" />
          <Text style={styles.downloadText}>Descarregar PDF...</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Pesquisar por título ou autor..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Search size={18} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      ) : (
        <FlatList
          data={trabalhos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.centerEmpty}>
              <FileText size={48} color="#cbd5e1" />
              <Text style={styles.emptyText}>Nenhum trabalho académico encontrado.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingTop: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40 },
  centerEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 80 },
  searchContainer: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  input: { 
    flex: 1, 
    height: 44, 
    backgroundColor: '#ffffff', 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    fontSize: 14, 
    color: '#0f172a' 
  },
  searchButton: { 
    backgroundColor: '#2563eb', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 44, 
    height: 44, 
    borderRadius: 8 
  },
  listContainer: { paddingBottom: 24 },
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  iconContainer: { 
    backgroundColor: '#eff6ff', 
    padding: 8, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerText: { flex: 1 },
  titulo: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 2 },
  autor: { fontSize: 12, color: '#64748b' },
  resumo: { fontSize: 12, color: '#475569', marginBottom: 12, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  data: { fontSize: 10, color: '#94a3b8' },
  downloadButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#2563eb', 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    borderRadius: 6, 
    gap: 6 
  },
  downloadText: { color: '#ffffff', fontSize: 12, fontWeight: '600' },
  emptyText: { fontSize: 14, color: '#64748b', marginTop: 8 }
});