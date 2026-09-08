import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

// Importação das Views Modulares
import DashboardView from "../views/DashboardView";
import EmprestimosView from "../views/EmprestimosView";
import ReservasView from "../views/ReservasView";
import UtilizadoresView from "../views/UtilizadoresView";
import ObrasView from "../views/ObrasView";
import ExemplaresView from "../views/ExemplaresView";
import TrabalhosView from "../views/TrabalhosView";
import FaculdadesView from "../views/FaculdadesView";

// Importação dos Modais
import UploadFicheiroModal from "../modals/UploadFicheiroModal";
import CriarExemplarModal from "../modals/CriarExemplarModal";
import CriarTrabalhoModal from "../modals/CriarTrabalhoModal";
import CriarObraModal from "../modals/CriarObraModal";

export default function DashboardAdmin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para as tabelas
  const [emprestimosList, setEmprestimosList] = useState([]);
  const [reservasList, setReservasList] = useState([]);
  const [utilizadoresList, setUtilizadoresList] = useState([]);
  const [faculdadesList, setFaculdadesList] = useState([]);
  const [obrasList, setObrasList] = useState([]);
  const [exemplaresList, setExemplaresList] = useState([]);
  const [trabalhosList, setTrabalhosList] = useState([]);
  // Adicione este estado junto aos outros modais/inputs:
  const [ficheiroObraInput, setFicheiroObraInput] = useState(null);

  // Estado criação faculdade
  const [novoItemNome, setNovoItemNome] = useState("");
  const [novoItemSigla, setNovoItemSigla] = useState("");

  // Modais e inputs
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [capaFicheiroInput, setCapaFicheiroInput] = useState(null);
  const [obraSelecionada, setObraSelecionada] = useState(null);
  const [ficheiroInput, setFicheiroInput] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Estados para a criação de Obras
  const [modalObraOpen, setModalObraOpen] = useState(false);
  const [novaObraData, setNovaObraData] = useState({
    titulo: "",
    autor: "",
    sinopse: "",
    isbn: "",
    ano_publicacao: "",
    tipo_recurso: "fisico",
    categoria_nome: "", // Em formato de texto livre
    editora_nome: "", // Em formato de texto livre
  });

  const [modalExemplarOpen, setModalExemplarOpen] = useState(false);
  const [novoExemplarData, setNovoExemplarData] = useState({
    obra_id: "",
    codigo_barras: "",
    localizacao_prateleira: "",
  });

  const [modalTrabalhoOpen, setModalTrabalhoOpen] = useState(false);
  const [novoTrabalhoData, setNovoTrabalhoData] = useState({
    titulo: "",
    autor: "",
    ano: "",
    faculdade_id: "",
  });
  const [ficheiroTrabalhoInput, setFicheiroTrabalhoInput] = useState(null);

  useEffect(() => {
    carregarDadosTab();
  }, [activeTab]);

  async function carregarDadosTab() {
    try {
      setLoading(true);
      if (activeTab === "dashboard") {
        const response = await api.get("/bibliotecario/dashboard");
        setData(response.data);
      } else if (activeTab === "emprestimos") {
        const response = await api.get("/bibliotecario/emprestimos");
        setEmprestimosList(response.data);
      } else if (activeTab === "reservas") {
        const response = await api.get("/bibliotecario/reservas");
        setReservasList(response.data);
      } else if (activeTab === "utilizadores") {
        const response = await api.get("/admin/utilizadores");
        setUtilizadoresList(response.data);
      } else if (activeTab === "faculdades") {
        const response = await api.get("/admin/faculdades");
        setFaculdadesList(response.data);
      } else if (activeTab === "obras") {
        const response = await api.get("/bibliotecario/obras");
        setObrasList(response.data);
      } else if (activeTab === "exemplares") {
        const response = await api.get("/bibliotecario/exemplares");
        setExemplaresList(response.data);
      } else if (activeTab === "trabalhos") {
        const response = await api.get("/bibliotecario/trabalhos");
        setTrabalhosList(response.data);
      }
    } catch (err) {
      console.error("Erro ao carregar dados do servidor", err);
    } finally {
      setLoading(false);
    }
  }

  // Carrega as obras no início para o select do modal de exemplares estar sempre preenchido
  useEffect(() => {
    async function carregarObrasIniciais() {
      try {
        const response = await api.get("/bibliotecario/obras");
        setObrasList(response.data);
      } catch (err) {
        console.error("Erro ao carregar obras para o modal", err);
      }
    }
    carregarObrasIniciais();
  }, []);

  async function handleDelete(endpoint, id) {
    if (!window.confirm("Tem certeza que deseja eliminar este registo?"))
      return;
    try {
      await api.delete(`${endpoint}/${id}`);
      carregarDadosTab();
    } catch (err) {
      alert("Erro ao eliminar registo.");
    }
  }

  async function handleConfirmarReserva(id) {
    try {
      await api.post(`/bibliotecario/reservas/${id}/confirmar`);
      alert("Reserva confirmada com sucesso!");
      carregarDadosTab();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao confirmar reserva.");
    }
  }

  // Carrega as faculdades no início para o select do modal de trabalhos estar sempre preenchido
  useEffect(() => {
    async function carregarFaculdadesIniciais() {
      try {
        const response = await api.get("/admin/faculdades");
        setFaculdadesList(response.data);
      } catch (err) {
        console.error("Erro ao carregar faculdades para o modal", err);
      }
    }
    carregarFaculdadesIniciais();
  }, []);

  async function handleCreateFaculdade(e) {
    e.preventDefault();
    if (!novoItemNome || !novoItemSigla) {
      alert("Preencha o nome e a sigla da faculdade.");
      return;
    }
    try {
      await api.post("/admin/faculdades", {
        nome: novoItemNome,
        sigla: novoItemSigla.toUpperCase(),
      });
      setNovoItemNome("");
      setNovoItemSigla("");
      carregarDadosTab();
    } catch (err) {
      alert("Erro ao criar faculdade.");
    }
  }

  async function handleCreateObra(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", novaObraData.titulo);
    formData.append("autor", novaObraData.autor);
    formData.append("sinopse", novaObraData.sinopse);
    formData.append("isbn", novaObraData.isbn);
    formData.append("ano_publicacao", novaObraData.ano_publicacao);
    formData.append("tipo_recurso", novaObraData.tipo_recurso);
    formData.append("categoria_nome", novaObraData.categoria_nome);
    formData.append("editora_nome", novaObraData.editora_nome);

    if (capaFicheiroInput) {
      formData.append("capa", capaFicheiroInput);
    }

    // Adiciona o ficheiro digital se preenchido
    if (ficheiroObraInput) {
      formData.append("ficheiro", ficheiroObraInput);
    }

    try {
      setUploading(true);
      await api.post("/bibliotecario/obras", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Obra e ficheiro digital registados com sucesso!");
      setModalObraOpen(false);
      setNovaObraData({
        titulo: "",
        autor: "",
        sinopse: "",
        isbn: "",
        ano_publicacao: "",
        tipo_recurso: "fisico",
        categoria_nome: "",
        editora_nome: "",
      });
      setCapaFicheiroInput(null);
      setFicheiroObraInput(null);
      carregarDadosTab();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.erro ||
          "Erro ao registar obra.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleCreateExemplar(e) {
    e.preventDefault();
    try {
      await api.post("/bibliotecario/exemplares", novoExemplarData);
      alert("Exemplar registado com sucesso!");
      setModalExemplarOpen(false);
      setNovoExemplarData({
        obra_id: "",
        codigo_barras: "",
        localizacao_prateleira: "",
      });
      carregarDadosTab();
    } catch (err) {
      alert(err.response?.data?.error || "Erro ao registar exemplar.");
    }
  }

  async function handleCreateTrabalho(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", novoTrabalhoData.titulo || "");
    formData.append("autor_estudante", novoTrabalhoData.autor_estudante || "");
    formData.append("ano_defesa", novoTrabalhoData.ano_defesa || "");
    formData.append("faculdade_id", novoTrabalhoData.faculdade_id || "");
    formData.append("tipo_trabalho", novoTrabalhoData.tipo_trabalho || "tcc");

    if (ficheiroTrabalhoInput) {
      formData.append("ficheiro", ficheiroTrabalhoInput);
    }

    try {
      setUploading(true);
      await api.post("/bibliotecario/trabalhos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Trabalho académico registado com sucesso!");
      setModalTrabalhoOpen(false);
      setNovoTrabalhoData({
        titulo: "",
        autor_estudante: "",
        ano_defesa: "",
        tipo_trabalho: "tcc",
        faculdade_id: "",
      });
      setFicheiroTrabalhoInput(null);
      carregarDadosTab();
    } catch (err) {
      alert(
        err.response?.data?.error ||
          err.response?.data?.detalhes ||
          "Erro ao registar trabalho.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleVerFicheiro(obraId) {
    try {
      const response = await api.get(`/bibliotecario/obras/${obraId}/ficheiro`);
      const ficheiro = response.data.dados;
      if (ficheiro?.ficheiro_url) {
        window.open(ficheiro.ficheiro_url, "_blank");
      } else {
        alert("Ficheiro não encontrado.");
      }
    } catch (err) {
      alert(
        err.response?.data?.error ||
          "Esta obra ainda não possui um ficheiro digital associado.",
      );
    }
  }

  async function handleUploadFicheiro(e) {
    e.preventDefault();
    if (!ficheiroInput) {
      alert("Por favor, selecione um ficheiro PDF ou EPUB.");
      return;
    }
    const formData = new FormData();
    formData.append("ficheiro", ficheiroInput);

    try {
      setUploading(true);
      await api.post(
        `/bibliotecario/obras/${obraSelecionada.id}/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      alert("Ficheiro digital carregado e associado com sucesso!");
      setUploadModalOpen(false);
      setFicheiroInput(null);
      setObraSelecionada(null);
      carregarDadosTab();
    } catch (err) {
      alert(
        err.response?.data?.error || "Erro ao efetuar o upload do ficheiro.",
      );
    } finally {
      setUploading(false);
    }
  }

  const { metricas, emprestimosRecentes } = data || {};
  const utilizadorLogado = JSON.parse(
    localStorage.getItem("utilizador") || "{}",
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-6 space-y-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Bem-vindo de volta, {utilizadorLogado.nome || "Administrador"}!
                👋
              </h2>
              <p className="text-xs text-slate-500">
                Gestão e controlo em tempo real do sistema bibliotecário.
              </p>
            </div>
            <span className="text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-medium">
              {new Date().toLocaleDateString("pt-PT", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {activeTab === "dashboard" && (
            <DashboardView
              loading={loading}
              metricas={metricas}
              emprestimosRecentes={emprestimosRecentes}
    reservasPendentes={data?.reservasPendentes} // <--- Passar isto
    onConfirmarReserva={handleConfirmarReserva} // <--- Passar isto
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "emprestimos" && (
            <EmprestimosView list={emprestimosList} onDelete={handleDelete} />
          )}
          {activeTab === "reservas" && (
            <ReservasView
              list={reservasList}
              onConfirmar={handleConfirmarReserva}
              onDelete={handleDelete}
            />
          )}
          {activeTab === "utilizadores" && (
            <UtilizadoresView list={utilizadoresList} onDelete={handleDelete} />
          )}
          {activeTab === "obras" && (
            <ObrasView
              list={obrasList}
              onVerFicheiro={handleVerFicheiro}
              onOpenUpload={(obra) => {
                setObraSelecionada(obra);
                setUploadModalOpen(true);
              }}
              onOpenModal={() => setModalObraOpen(true)}
              onDelete={handleDelete}
            />
          )}
          {activeTab === "exemplares" && (
            <ExemplaresView
              list={exemplaresList}
              onOpenModal={() => setModalExemplarOpen(true)}
              onDelete={handleDelete}
            />
          )}
          {activeTab === "trabalhos" && (
            <TrabalhosView
              list={trabalhosList}
              onOpenModal={() => setModalTrabalhoOpen(true)}
              onDelete={handleDelete}
            />
          )}
          {activeTab === "faculdades" && (
            <FaculdadesView
              list={faculdadesList}
              nome={novoItemNome}
              setNome={setNovoItemNome}
              sigla={novoItemSigla}
              setSigla={setNovoItemSigla}
              onSubmit={handleCreateFaculdade}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      <UploadFicheiroModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        obraSelecionada={obraSelecionada}
        onUpload={handleUploadFicheiro}
        setFicheiroInput={setFicheiroInput}
        uploading={uploading}
      />
      <CriarExemplarModal
        isOpen={modalExemplarOpen}
        onClose={() => setModalExemplarOpen(false)}
        data={novoExemplarData}
        setData={setNovoExemplarData}
        onSubmit={handleCreateExemplar}
        obrasList={obrasList}
      />
      <CriarTrabalhoModal
        isOpen={modalTrabalhoOpen}
        onClose={() => setModalTrabalhoOpen(false)}
        data={novoTrabalhoData}
        setData={setNovoTrabalhoData}
        setFicheiro={setFicheiroTrabalhoInput}
        faculdadesList={faculdadesList} // <-- Adiciona esta linha aqui
        onSubmit={handleCreateTrabalho}
        uploading={uploading}
      />
      <CriarObraModal
        isOpen={modalObraOpen}
        onClose={() => setModalObraOpen(false)}
        data={novaObraData}
        setData={setNovaObraData}
        setCapaFile={setCapaFicheiroInput}
        setFicheiroFile={setFicheiroObraInput}
        onSubmit={handleCreateObra}
      />
    </div>
  );
}
