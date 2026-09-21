import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Alert,
  Linking,
  Image,
  Keyboard,
  Platform,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar, LocaleConfig } from "react-native-calendars";
import api from "../services/api";

// Configuração opcional do Calendário para Português
LocaleConfig.locales["pt"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan.",
    "Fev.",
    "Mar.",
    "Abr.",
    "Mai.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Set.",
    "Out.",
    "Nov.",
    "Dez.",
  ],
  dayNames: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  today: "Hoje",
};
LocaleConfig.defaultLocale = "pt";

// Função auxiliar para calcular e formatar o tamanho do ficheiro
function formatarBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

// Medida de Segurança: Validar URLs antes de abrir externamente
async function abrirUrlSegura(url) {
  if (!url || typeof url !== "string") {
    Alert.alert("Erro", "Endereço de ficheiro inválido.");
    return;
  }

  const regexUrlSegura = /^https?:\/\/.+/i;
  if (!regexUrlSegura.test(url)) {
    Alert.alert("Erro de Segurança", "O link fornecido não é seguro.");
    return;
  }

  try {
    const suportado = await Linking.canOpenURL(url);
    if (suportado) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        "Erro",
        "O dispositivo não consegue abrir este tipo de link.",
      );
    }
  } catch (error) {
    Alert.alert("Erro", "Não foi possível abrir o link do ficheiro.");
  }
}

export default function DetalhesObraScreen({ navigation, route }) {
  const { obraId, obra: obraParam } = route.params || {};
  const [obra, setObra] = useState(obraParam || null);
  const [loading, setLoading] = useState(!obraParam);
  const [favorito, setFavorito] = useState(false);

  // Estados para o Modal de Agendamento Interativo
  const [modalDataVisivel, setModalDataVisivel] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(""); // Formato 'YYYY-MM-DD'
  const [horaSelecionada, setHoraSelecionada] = useState("08:00"); // Hora padrão inicial

  // Horários disponíveis permitidos (08:00 às 14:00)
  const horariosDisponiveis = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
  ];

  useEffect(() => {
    if (obraId) {
      buscarDetalhesObra();
    }
  }, [obraId]);

  async function buscarDetalhesObra() {
    try {
      setLoading(true);
      const response = await api.get(`/api/public/obras/${obraId}`);
      if (response.data) {
        setObra(response.data);
      }
    } catch (error) {
      console.error(
        "[DetalhesObra] ❌ Erro ao buscar detalhes:",
        error.message,
      );
    } finally {
      setLoading(false);
    }
  }

  const confirmarAgendamento = () => {
    if (!dataSelecionada) {
      Alert.alert("Atenção", "Por favor, selecione uma data no calendário.");
      return;
    }

    // Cria a data combinada considerando o fuso/horário local
    const dataEscolhida = new Date(`${dataSelecionada}T${horaSelecionada}:00`);
    const agora = new Date();

    if (dataEscolhida <= agora) {
      Alert.alert("Erro", "A data e hora de levantamento devem ser no futuro.");
      return;
    }

    const diaSemana = dataEscolhida.getDay(); // 0 = Domingo, 6 = Sábado
    if (diaSemana === 0 || diaSemana === 6) {
      Alert.alert(
        "Erro",
        "O levantamento só pode ser agendado de Segunda a Sexta-feira.",
      );
      return;
    }

    const hora = dataEscolhida.getHours();
    if (hora < 8 || hora >= 15) {
      Alert.alert(
        "Erro",
        "O horário de levantamento deve ser entre as 08:00 e as 15:00.",
      );
      return;
    }

    setModalDataVisivel(false);

    // Navegar para o ecrã de confirmação final passando os dados estruturados
    handleNavegacaoSegura(() =>
      navigation.navigate("ReservarExemplar", {
        obra,
        data_prevista_levantamento: dataEscolhida.toISOString(),
      }),
    );
  };

  // Função segura para navegação e limpeza de foco na Web
  const handleNavegacaoSegura = (callback) => {
    if (Platform.OS === "web") {
      Keyboard.dismiss();
      if (
        document.activeElement &&
        typeof document.activeElement.blur === "function"
      ) {
        document.activeElement.blur();
      }
    }
    if (callback) callback();
  };

  const handleVoltar = () => {
    handleNavegacaoSegura(() => navigation.goBack());
  };

  async function handleReservar() {
    if (!obra) return;
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        if (Platform.OS === "web") {
          const confirmar = window.confirm(
            "Precisa de iniciar sessão. Deseja ir para o Login?",
          );
          if (confirmar)
            handleNavegacaoSegura(() => navigation.navigate("Login"));
        } else {
          Alert.alert(
            "Autenticação Necessária",
            "Precisa de iniciar sessão na sua conta.",
            [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Fazer Login",
                onPress: () =>
                  handleNavegacaoSegura(() => navigation.navigate("Login")),
              },
            ],
          );
        }
        return;
      }

      // Abre o modal interativo do calendário
      setModalDataVisivel(true);
    } catch (error) {
      console.error("[DEBUG] Erro crítico:", error);
    }
  }

  async function handleAbrirDigital() {
    const infoFicheiro = obra?.ficheiro?.[0];

    if (infoFicheiro && infoFicheiro.ficheiro_url) {
      await abrirUrlSegura(infoFicheiro.ficheiro_url);
      return;
    }

    try {
      const response = await api.get(`/api/public/obras/${obra.id}/ficheiro`);
      if (response.data && response.data.download_url) {
        await abrirUrlSegura(response.data.download_url);
      } else {
        Alert.alert(
          "Aviso",
          "Link de ficheiro digital indisponível no momento.",
        );
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert(
          "Indisponível",
          "Esta obra digital ainda não possui ficheiro associado na base de dados.",
        );
      } else {
        Alert.alert("Erro", "Não foi possível aceder ao ficheiro digital.");
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  if (!obra) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorTitle}>Obra não encontrada</Text>
        <TouchableOpacity style={styles.backBtnAlert} onPress={handleVoltar}>
          <Text style={styles.backBtnAlertText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tipoRecursoStr = obra.tipo_recurso
    ? obra.tipo_recurso.toLowerCase()
    : "";
  const isDigital =
    tipoRecursoStr === "digital" ||
    tipoRecursoStr === "pdf" ||
    tipoRecursoStr === "epub";

  const nomeEditora = obra.Editora?.nome || obra.editora || "Não especificada";
  const nomeCategoria =
    obra.Categorium?.nome || obra.Categoria?.nome || "Geral";
  const exemplar = obra.ExemplarFisicos?.[0] || obra.ExemplarFisico?.[0] || {};

  const ficheiroDigital = obra.ficheiro?.[0];
  const temFicheiroDisponivel = Boolean(ficheiroDigital?.ficheiro_url);

  const tamanhoFicheiro = ficheiroDigital?.tamanho_bytes
    ? formatarBytes(ficheiroDigital.tamanho_bytes)
    : "Desconhecido";

  const qtdDisponivel =
    obra.quantidade_disponivel ??
    (exemplar.estado === "disponivel" || exemplar.estado === "DISPONIVEL"
      ? 1
      : 0);
  const isDisponivel =
    qtdDisponivel > 0 || (isDigital && temFicheiroDisponivel);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />

      {/* Header com Ações */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleVoltar} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Detalhes da Obra
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setFavorito(!favorito)}
          >
            <Ionicons
              name={favorito ? "bookmark" : "bookmark-outline"}
              size={20}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner do Livro */}
        <View style={styles.mainInfoCard}>
          {obra.capa_url ? (
            <Image
              source={{ uri: obra.capa_url }}
              style={styles.coverImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.coverLarge}>
              <Ionicons
                name={isDigital ? "document-text-outline" : "book-outline"}
                size={54}
                color="#1e3a8a"
              />
            </View>
          )}

          <View style={styles.mainTextContainer}>
            <Text style={styles.title}>{obra.titulo || "Sem Título"}</Text>
            <Text style={styles.author}>
              {obra.autor || "Autor Desconhecido"}
            </Text>

            <View style={styles.metaGrid}>
              <Text style={styles.metaLabel}>
                Categoria: <Text style={styles.metaVal}>{nomeCategoria}</Text>
              </Text>
              <Text style={styles.metaLabel}>
                Editora: <Text style={styles.metaVal}>{nomeEditora}</Text>
              </Text>
              <Text style={styles.metaLabel}>
                Ano:{" "}
                <Text style={styles.metaVal}>
                  {obra.ano_publicacao || "N/A"}
                </Text>
              </Text>
              <Text style={styles.metaLabel}>
                ISBN: <Text style={styles.metaVal}>{obra.isbn || "N/A"}</Text>
              </Text>

              {isDigital && ficheiroDigital && (
                <Text style={styles.metaLabel}>
                  Tamanho:{" "}
                  <Text style={[styles.metaVal, { color: "#2563eb" }]}>
                    {tamanhoFicheiro} ({ficheiroDigital.formato?.toUpperCase()})
                  </Text>
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Sinopse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sinopse</Text>
          <Text style={styles.sinopseText}>
            {obra.sinopse || "Sem sinopse disponível para esta obra."}
          </Text>
        </View>

        {/* Localização Física */}
        {!isDigital && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Localização (Exemplar físico)
            </Text>
            <View style={styles.locationGrid}>
              <View style={styles.locationBox}>
                <Text style={styles.locLabel}>Estado Físico</Text>
                <Text style={styles.locVal}>{exemplar.estado || "N/A"}</Text>
              </View>
              <View style={[styles.locationBox, { width: "48%" }]}>
                <Text style={styles.locLabel}>Prateleira / Localização</Text>
                <Text style={styles.locVal} numberOfLines={1}>
                  {exemplar.localizacao_prateleira || "N/A"}
                </Text>
              </View>
              <View style={[styles.locationBox, { width: "48%" }]}>
                <Text style={styles.locLabel}>Código Exemplar</Text>
                <Text style={styles.locVal}>
                  {exemplar.codigo_exemplar || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Estado Dinâmico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isDisponivel ? "#dcfce7" : "#fee2e2" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isDisponivel ? "#16a34a" : "#dc2626" },
              ]}
            />
            <Text
              style={[
                styles.statusBadgeText,
                { color: isDisponivel ? "#15803d" : "#b91c1c" },
              ]}
            >
              {isDisponivel
                ? isDigital
                  ? "Disponível Online"
                  : "Disponível"
                : "Indisponível (Sem Ficheiro/Stock)"}
            </Text>
          </View>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          {isDigital ? (
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                {
                  backgroundColor: temFicheiroDisponivel
                    ? "#2563eb"
                    : "#94a3b8",
                },
              ]}
              onPress={handleAbrirDigital}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <Ionicons name="download-outline" size={20} color="#ffffff" />
                <Text style={styles.btnPrimaryText}>
                  {temFicheiroDisponivel
                    ? "BAIXAR / LER PDF"
                    : "FICHEIRO BREVEMENTE DISPONÍVEL"}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.btnPrimary,
                !isDisponivel && { backgroundColor: "#94a3b8" },
              ]}
              onPress={handleReservar}
              disabled={!isDisponivel}
            >
              <Text style={styles.btnPrimaryText}>
                RESERVAR PARA LEVANTAMENTO
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.btnSecondary}
            onPress={() => {
              setFavorito(!favorito);
              Alert.alert(
                "Sucesso",
                !favorito
                  ? "Adicionado aos favoritos!"
                  : "Removido dos favoritos.",
              );
            }}
          >
            <Text style={styles.btnSecondaryText}>
              {favorito ? "REMOVER DOS FAVORITOS" : "ADICIONAR AOS FAVORITOS"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL INTERATIVO COM CALENDÁRIO GRÁFICO */}
      <Modal
        visible={modalDataVisivel}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalDataVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Agendar Levantamento</Text>
              <TouchableOpacity onPress={() => setModalDataVisivel(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Selecione um dia útil (Segunda a Sexta) e o horário desejado:
            </Text>

            {/* Componente Gráfico do Calendário */}
            <Calendar
              onDayPress={(day) => setDataSelecionada(day.dateString)}
              markedDates={{
                [dataSelecionada]: { selected: true, selectedColor: "#1e3a8a" },
              }}
              minDate={
                new Date(Date.now() + 86400000).toISOString().split("T")[0]
              }
              theme={{
                todayTextColor: "#ffffdd",
                selectedDayBackgroundColor: "#1e3a8a",
                selectedDayTextColor: "#ffffff",
                arrowColor: "#1e3a8a",
                textDayFontWeight: "500",
                textMonthFontWeight: "bold",
                textDayHeaderFontWeight: "600",
                textDisabledColor: "#d9e0e8", // Cor dos dias bloqueados
              }}
              style={styles.calendarStyle}
            />

            {/* Seleção de Horas Estilizada */}
            <Text style={styles.timeLabel}>Horário Disponível:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeChipsContainer}
            >
              {horariosDisponiveis.map((hora) => {
                const selecionado = horaSelecionada === hora;
                return (
                  <TouchableOpacity
                    key={hora}
                    style={[
                      styles.timeChip,
                      selecionado && styles.timeChipSelected,
                    ]}
                    onPress={() => setHoraSelecionada(hora)}
                  >
                    <Text
                      style={[
                        styles.timeChipText,
                        selecionado && styles.timeChipTextSelected,
                      ]}
                    >
                      {hora}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.btnCancelarModal}
                onPress={() => setModalDataVisivel(false)}
              >
                <Text style={styles.btnCancelarModalText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnConfirmarModal}
                onPress={confirmarAgendamento}
              >
                <Text style={styles.btnConfirmarModalText}>Avançar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    backgroundColor: "#1e3a8a",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    marginLeft: 12,
  },
  iconBtn: { padding: 4 },
  scrollContent: { padding: 16 },
  mainInfoCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  coverImage: {
    width: 100,
    height: 145,
    borderRadius: 8,
    marginRight: 14,
    backgroundColor: "#e2e8f0",
  },
  coverLarge: {
    width: 100,
    height: 145,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  mainTextContainer: { flex: 1, justifyContent: "center" },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 4,
  },
  author: { fontSize: 13, color: "#475569", marginBottom: 10 },
  metaGrid: { gap: 4 },
  metaLabel: { fontSize: 11, color: "#64748b" },
  metaVal: { color: "#0f172a", fontWeight: "600" },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 8,
  },
  sinopseText: { fontSize: 12, color: "#334155", lineHeight: 18 },
  locationGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  locationBox: {
    alignItems: "flex-start",
    backgroundColor: "#f1f5f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: "48%",
  },
  locLabel: { fontSize: 10, color: "#64748b", marginBottom: 2 },
  locVal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    textTransform: "capitalize",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    gap: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusBadgeText: { fontWeight: "bold", fontSize: 12 },
  actionsContainer: { gap: 10, marginTop: 8, marginBottom: 24 },
  btnPrimary: {
    backgroundColor: "#16a34a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  btnPrimaryText: { color: "#ffffff", fontWeight: "bold", fontSize: 13 },
  btnSecondary: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSecondaryText: { color: "#475569", fontWeight: "bold", fontSize: 12 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 12,
  },
  backBtnAlert: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e3a8a",
    borderRadius: 6,
  },
  backBtnAlertText: { color: "#ffffff", fontWeight: "bold" },

  // Estilos do Modal de Calendário
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: { fontSize: 16, fontWeight: "bold", color: "#1e3a8a" },
  modalSubtitle: { fontSize: 12, color: "#64748b", marginBottom: 12 },
  calendarStyle: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#334155",
    marginBottom: 6,
  },
  timeChipsContainer: { gap: 8, paddingBottom: 8, marginBottom: 16 },
  timeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  timeChipSelected: {
    backgroundColor: "#1e3a8a",
    borderColor: "#1e3a8a",
  },
  timeChipText: { fontSize: 12, fontWeight: "600", color: "#475569" },
  timeChipTextSelected: { color: "#ffffff" },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  btnCancelarModal: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  btnCancelarModalText: { fontSize: 12, fontWeight: "bold", color: "#475569" },
  btnConfirmarModal: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#16a34a",
  },
  btnConfirmarModalText: { fontSize: 12, fontWeight: "bold", color: "#ffffff" },
});
