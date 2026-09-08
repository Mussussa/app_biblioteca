import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function HomeScreen({ navigation }) {
  const [utilizador, setUtilizador] = useState(null);
  const [livrosRecomendados, setLivrosRecomendados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);

      // 1. Carregar utilizador guardado (se existir)
      const userJSON = await AsyncStorage.getItem("utilizador");
      if (userJSON) {
        setUtilizador(JSON.parse(userJSON));
      }

      // 2. Buscar recomendações na Rota Pública Real (/api/public/obras)
      const response = await api.get("/api/public/obras");

      if (response.data && response.data.obras) {
        setLivrosRecomendados(response.data.obras);
      } else if (Array.isArray(response.data)) {
        setLivrosRecomendados(response.data);
      } else {
        setLivrosRecomendados([
          {
            id: "1",
            titulo: "Estruturas de Dados",
            autor: "João Manuel",
            ano_publicacao: 2024,
            tipo_recurso: "Físico",
          },
          {
            id: "2",
            titulo: "Sistemas Operativos",
            autor: "Maria da Conceição",
            ano_publicacao: 2025,
            tipo_recurso: "PDF",
          },
          {
            id: "3",
            titulo: "Banco de Dados",
            autor: "António Macuácua",
            ano_publicacao: 2023,
            tipo_recurso: "Físico",
          },
        ]);
      }
    } catch (error) {
      console.log(
        "Aviso: Carregando obras de fallback devido a erro de rede",
        error.message,
      );
      setLivrosRecomendados([
        {
          id: "1",
          titulo: "Estruturas de Dados",
          autor: "João Manuel",
          ano_publicacao: 2024,
          tipo_recurso: "Físico",
        },
        {
          id: "2",
          titulo: "Sistemas Operativos",
          autor: "Maria da Conceição",
          ano_publicacao: 2025,
          tipo_recurso: "PDF",
        },
        {
          id: "3",
          titulo: "Banco de Dados",
          autor: "António Macuácua",
          ano_publicacao: 2023,
          tipo_recurso: "Físico",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* Header Azul */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>
              Olá, {utilizador ? utilizador.nome.split(" ")[0] : "Visitante"} 👋
            </Text>
            <Text style={styles.userRole}>
              {utilizador
                ? `${utilizador.perfil === "estudante" ? "Estudante" : "Utilizador"} • ${utilizador.curso || "UniPúnguè"}`
                : "Aceda ou crie uma conta para mais recursos"}
            </Text>
          </View>

          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Barra de Pesquisa */}
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("CatalogoTab")}
        >
          <Ionicons name="search-outline" size={18} color="#64748b" />
          <Text style={styles.searchPlaceholder}>
            Pesquisar por título, autor ou ISBN...
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Atalhos Rápidos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Atalhos rápidos</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CatalogoTab")}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.shortcutsGrid}>
          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() =>
              navigation.navigate("CatalogoTab", { filtro: "Físico" })
            }
          >
            <View
              style={[
                styles.shortcutIconContainer,
                { backgroundColor: "#dbeafe" },
              ]}
            >
              <Ionicons name="book-outline" size={22} color="#2563eb" />
            </View>
            <Text style={styles.shortcutLabel}>Livros Físicos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() =>
              navigation.navigate("CatalogoTab", { filtro: "PDF" })
            }
          >
            <View
              style={[
                styles.shortcutIconContainer,
                { backgroundColor: "#dcfce7" },
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#16a34a"
              />
            </View>
            <Text style={styles.shortcutLabel}>E-books</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => navigation.navigate("TrabalhosTab")}
          >
            <View
              style={[
                styles.shortcutIconContainer,
                { backgroundColor: "#f3e8ff" },
              ]}
            >
              <Ionicons name="school-outline" size={22} color="#9333ea" />
            </View>
            <Text style={styles.shortcutLabel}>Repositório</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutCard}
            onPress={() => {
              if (!utilizador) {
                navigation.navigate("Login");
              } else {
                navigation.navigate("PerfilTab");
              }
            }}
          >
            <View
              style={[
                styles.shortcutIconContainer,
                { backgroundColor: "#ffedd5" },
              ]}
            >
              <Ionicons name="time-outline" size={22} color="#ea580c" />
            </View>
            <Text style={styles.shortcutLabel}>Minhas Devoluções</Text>
          </TouchableOpacity>
        </View>

        {/* Card Novas Aquisições */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>Novas Aquisições</Text>
            <Text style={styles.bannerSubtitle}>
              Confira os novos livros disponíveis na nossa biblioteca.
            </Text>
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() => navigation.navigate("CatalogoTab")}
            >
              <Text style={styles.bannerButtonText}>VER LIVROS</Text>
            </TouchableOpacity>
          </View>
          <Ionicons
            name="library"
            size={80}
            color="rgba(255, 255, 255, 0.2)"
            style={styles.bannerBgIcon}
          />
        </View>

        {/* Seção Recomendados */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recomendados para si</Text>
          <TouchableOpacity onPress={() => navigation.navigate("CatalogoTab")}>
            <Text style={styles.seeAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#2563eb"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {livrosRecomendados.map((livro) => {
              const tipoRecurso = (
                livro.tipo_recurso || "FÍSICO"
              ).toUpperCase();
              const isDigital =
                tipoRecurso === "PDF" ||
                tipoRecurso === "EPUB" ||
                tipoRecurso === "DIGITAL";

              return (
                <TouchableOpacity
                  key={livro.id}
                  style={styles.bookCard}
                  onPress={() =>
                    navigation.navigate("DetalhesObra", { obraId: livro.id })
                  }
                >
                  <View style={styles.bookCoverContainer}>
                    {livro.capa_url ? (
                      <Image
                        source={{ uri: livro.capa_url }}
                        style={styles.bookCoverImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.bookCoverPlaceholder}>
                        <Ionicons
                          name={
                            isDigital ? "document-text-outline" : "book-outline"
                          }
                          size={32}
                          color="#1e3a8a"
                        />
                      </View>
                    )}
                    <Text style={styles.bookCoverTag}>{tipoRecurso}</Text>
                  </View>
                  <Text style={styles.bookTitle} numberOfLines={1}>
                    {livro.titulo}
                  </Text>
                  <Text style={styles.bookAuthor} numberOfLines={1}>
                    {livro.autor}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: isDigital ? "#e0f2fe" : "#dcfce7" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: isDigital ? "#0369a1" : "#15803d" },
                      ]}
                    >
                      {isDigital ? "Digital" : "Disponível"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e3a8a",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  userRole: {
    fontSize: 12,
    color: "#93c5fd",
    marginTop: 2,
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchPlaceholder: {
    color: "#94a3b8",
    fontSize: 13,
  },
  scrollContent: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0f172a",
  },
  seeAllText: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: "600",
  },
  shortcutsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  shortcutCard: {
    alignItems: "center",
    width: "22%",
  },
  shortcutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  shortcutLabel: {
    fontSize: 11,
    color: "#334155",
    textAlign: "center",
    fontWeight: "500",
  },
  bannerContainer: {
    backgroundColor: "#1d4ed8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    position: "relative",
    overflow: "hidden",
  },
  bannerTextContainer: {
    width: "70%",
  },
  bannerTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "#bfdbfe",
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  bannerButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#1d4ed8",
    fontSize: 11,
    fontWeight: "bold",
  },
  bannerBgIcon: {
    position: "absolute",
    right: -10,
    bottom: -10,
  },
  horizontalList: {
    gap: 12,
    paddingRight: 20,
  },
  bookCard: {
    width: 130,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  bookCoverContainer: {
    height: 120,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    marginBottom: 8,
    position: "relative",
    overflow: "hidden",
  },
  bookCoverPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bookCoverImage: {
    width: "100%",
    height: "100%",
  },
  bookCoverTag: {
    position: "absolute",
    top: 6,
    right: 6,
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e3a8a",
    backgroundColor: "#ffffff",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    zIndex: 2,
  },
  bookTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  bookAuthor: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 6,
  },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});