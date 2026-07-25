import React, { useEffect, useState } from 'react';
import { 
  Sun, 
  Moon, 
  Search, 
  Plus, 
  Trash2, 
  Shirt, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  Filter,
  Sparkles
} from 'lucide-react';

export default function App() {
  // Theme state: dark or light
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Active Tab: 'verificador' | 'pecas' | 'estampas'
  const [activeTab, setActiveTab] = useState('verificador');

  // Brands State
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(''); // '' = Todas

  // Data States
  const [estampas, setEstampas] = useState([]);
  const [pecasProntas, setPecasProntas] = useState([]);

  // Verificador / Quick SKU Search
  const [skuSearch, setSkuSearch] = useState('CM-001-PRE-M');
  const [verificacaoResult, setVerificacaoResult] = useState(null);
  const [verificando, setVerificando] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('peca'); // 'peca' | 'estampa'
  const [formData, setFormData] = useState({});

  // Sync Theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Fetch initial data
  useEffect(() => {
    fetchBrands();
    fetchEstampas();
    fetchPecasProntas();
  }, [selectedBrand]);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error('Erro ao buscar marcas:', err);
    }
  };

  const fetchEstampas = async () => {
    try {
      const url = selectedBrand ? `/api/estampas?brand_id=${selectedBrand}` : '/api/estampas';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEstampas(data);
      }
    } catch (err) {
      console.error('Erro ao buscar estampas:', err);
    }
  };

  const fetchPecasProntas = async () => {
    try {
      const url = selectedBrand ? `/api/pecas-prontas?brand_id=${selectedBrand}` : '/api/pecas-prontas';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPecasProntas(data);
      }
    } catch (err) {
      console.error('Erro ao buscar peças prontas:', err);
    }
  };

  // Execute SKU Search Verification
  const handleVerificarSKU = async (e) => {
    if (e) e.preventDefault();
    if (!skuSearch.trim()) return;

    setVerificando(true);
    try {
      const url = `/api/verificar-disponibilidade?sku=${encodeURIComponent(skuSearch.trim())}${selectedBrand ? `&brand_id=${selectedBrand}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVerificacaoResult(data);
      }
    } catch (err) {
      console.error('Erro na verificação de SKU:', err);
    } finally {
      setVerificando(false);
    }
  };

  // Auto verify default SKU on load
  useEffect(() => {
    handleVerificarSKU();
  }, [selectedBrand]);

  // Adjust Quantity (+1 or -1)
  const handleAjustarQtdPeca = async (id, delta) => {
    const peca = pecasProntas.find(p => p.id === id);
    if (!peca) return;
    const novaQtd = Math.max(0, peca.quantidade + delta);
    
    try {
      const res = await fetch(`/api/pecas-prontas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: novaQtd })
      });
      if (res.ok) {
        fetchPecasProntas();
        handleVerificarSKU();
      }
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err);
    }
  };

  const handleAjustarQtdEstampa = async (id, delta) => {
    const estampa = estampas.find(e => e.id === id);
    if (!estampa) return;
    const novaQtd = Math.max(0, estampa.quantidade + delta);

    try {
      const res = await fetch(`/api/estampas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: novaQtd })
      });
      if (res.ok) {
        fetchEstampas();
        handleVerificarSKU();
      }
    } catch (err) {
      console.error('Erro ao atualizar cantidad de estampa:', err);
    }
  };

  // Delete handlers
  const handleDeletarPeca = async (id) => {
    if (!confirm('Deseja realmente remover este SKU do estoque?')) return;
    try {
      const res = await fetch(`/api/pecas-prontas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPecasProntas();
    } catch (err) {
      console.error('Erro ao deletar peça:', err);
    }
  };

  const handleDeletarEstampa = async (id) => {
    if (!confirm('Deseja realmente remover esta estampa do estoque?')) return;
    try {
      const res = await fetch(`/api/estampas/${id}`, { method: 'DELETE' });
      if (res.ok) fetchEstampas();
    } catch (err) {
      console.error('Erro ao deletar estampa:', err);
    }
  };

  // Form Submission
  const handleSalvarModal = async (e) => {
    e.preventDefault();
    const endpoint = modalType === 'peca' ? '/api/pecas-prontas' : '/api/estampas';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          brand_id: Number(formData.brand_id || brands[0]?.id || 1)
        })
      });
      if (res.ok) {
        setShowModal(false);
        setFormData({});
        if (modalType === 'peca') fetchPecasProntas();
        else fetchEstampas();
        handleVerificarSKU();
      } else {
        const errData = await res.json();
        alert(errData.erro || 'Erro ao salvar registro');
      }
    } catch (err) {
      console.error('Erro no salvamento:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between transition-colors duration-200">
      
      {/* HEADER / NAVBAR ULTRA-RESPONSIVO */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 min-h-[64px] flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold shrink-0">
              <Shirt className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  HC_comp
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Estoque
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Clube Rock & Ride Nation (pt-BR)
              </p>
            </div>
          </div>

          {/* Controls: Brand Selector + Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Filter by Brand */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 focus:outline-none pr-1 cursor-pointer max-w-[130px] sm:max-w-none text-xs"
              >
                <option value="" className="bg-white dark:bg-slate-900">Todas as Marcas</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id} className="bg-white dark:bg-slate-900">{b.name}</option>
                ))}
              </select>
            </div>

            {/* Toggle Sol / Lua */}
            <button
              onClick={toggleTheme}
              title={`Alternar para modo ${theme === 'dark' ? 'Claro' : 'Escuro'}`}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* NAVIGATION TABS SCROLLABLE NO MOBILE */}
      <div className="bg-white dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 sm:gap-2 pt-2 min-w-max">
          <button
            onClick={() => setActiveTab('verificador')}
            className={`px-3 sm:px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'verificador'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Verificador de Envio (SKU)
          </button>
          <button
            onClick={() => setActiveTab('pecas')}
            className={`px-3 sm:px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'pecas'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Shirt className="w-4 h-4" />
            Peças Prontas ({pecasProntas.length})
          </button>
          <button
            onClick={() => setActiveTab('estampas')}
            className={`px-3 sm:px-4 py-2.5 font-semibold text-xs rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'estampas'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Estampas Avulsas ({estampas.length})
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 w-full">

        {/* ------------------------------------------------------------- */}
        {/* ABA 1: VERIFICADOR DE DISPONIBILIDADE E PRONTO PARA ENVIO     */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'verificador' && (
          <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">

            {/* Banner de Boas-Vindas */}
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                Verificação Rápida de Estoque
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Consulte o SKU da peça do pedido para confirmar envio imediato ou se a estampa está disponível para montagem rápida.
              </p>
            </div>

            {/* Barra de Busca de SKU Responsiva */}
            <form onSubmit={handleVerificarSKU} className="max-w-xl mx-auto flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={skuSearch}
                  onChange={(e) => setSkuSearch(e.target.value.toUpperCase())}
                  placeholder="Digite o SKU (ex: CM-001-PRE-M)"
                  className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-sm text-sm font-mono font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase tracking-wider"
                />
              </div>
              <button
                type="submit"
                disabled={verificando}
                className="px-6 py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                {verificando ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Verificar'}
              </button>
            </form>

            {/* Chips de Exemplo */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
              <span className="text-slate-400 font-medium w-full sm:w-auto text-center">Exemplos rápidos:</span>
              {['CM-001-PRE-M', 'CM-001-PRE-G', 'MO-002-BRA-L', 'CM-010-PRE-G', 'CF-011-BRA-M'].map((exSku) => (
                <button
                  key={exSku}
                  onClick={() => { setSkuSearch(exSku); }}
                  className="px-2.5 py-1 bg-slate-200/60 dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-slate-700 font-mono rounded-lg transition-colors text-slate-700 dark:text-slate-300 text-[11px]"
                >
                  {exSku}
                </button>
              ))}
            </div>

            {/* CARD DE RESULTADO DA VERIFICAÇÃO RESPONSIVO */}
            {verificacaoResult && (
              <div className="p-4 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 sm:space-y-6">
                
                {/* Header do Card com Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      SKU Consultado ({verificacaoResult.brand_name})
                    </span>
                    <h3 className="text-xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white mt-1 break-all">
                      {verificacaoResult.sku}
                    </h3>
                  </div>

                  {/* Badge de Status Principal */}
                  <div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-sm ${
                    verificacaoResult.badge_color === 'emerald'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : verificacaoResult.badge_color === 'amber'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {verificacaoResult.badge_color === 'emerald' && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                    {verificacaoResult.badge_color === 'amber' && <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                    {verificacaoResult.badge_color === 'rose' && <XCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
                    <span>{verificacaoResult.status_label}</span>
                  </div>
                </div>

                {/* Mensagem Explicativa */}
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  {verificacaoResult.mensagem}
                </p>

                {/* Grid Comparativo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
                  
                  {/* Qtd Peça Pronta */}
                  <div className={`p-4 sm:p-5 rounded-2xl border ${
                    verificacaoResult.peca_pronta_qtd > 0 
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50' 
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        1. PEÇA PRONTA (Estampada)
                      </span>
                      <Shirt className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold">{verificacaoResult.peca_pronta_qtd}</span>
                      <span className="text-xs text-slate-500 font-medium">unidades em estoque</span>
                    </div>
                  </div>

                  {/* Qtd Estampa Avulsa */}
                  <div className={`p-4 sm:p-5 rounded-2xl border ${
                    verificacaoResult.estampa_qtd > 0 
                      ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50' 
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        2. ESTAMPA AVULSA ({verificacaoResult.codigo_estampa})
                      </span>
                      <Layers className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold">{verificacaoResult.estampa_qtd}</span>
                      <span className="text-xs text-slate-500 font-medium">unidades disponíveis</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 truncate">
                      Design: {verificacaoResult.nome_design_estampa}
                    </p>
                  </div>

                </div>

              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ABA 2: PEÇAS PRONTAS (PRODUTOS STAMPADOS PRONTOS)             */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'pecas' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Estoque de Peças Prontas</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Camisetas e moletons já estampados e prontos para envio.
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('peca');
                  setFormData({ tipo: 'CM', cor: 'PRE', tamanho: 'M', quantidade: 1, brand_id: brands[0]?.id || 1 });
                  setShowModal(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Nova Peça Pronta
              </button>
            </div>

            {/* Data Table Scrollable */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 sm:px-6 py-3.5">SKU Completo</th>
                      <th className="px-4 sm:px-6 py-3.5">Tipo</th>
                      <th className="px-4 sm:px-6 py-3.5">Cód. Estampa</th>
                      <th className="px-4 sm:px-6 py-3.5">Cor</th>
                      <th className="px-4 sm:px-6 py-3.5">Tamanho</th>
                      <th className="px-4 sm:px-6 py-3.5">Marca</th>
                      <th className="px-4 sm:px-6 py-3.5">Qtd Estoque</th>
                      <th className="px-4 sm:px-6 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {pecasProntas.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-slate-400">
                          Nenhuma peça pronta cadastrada para esta seleção.
                        </td>
                      </tr>
                    ) : (
                      pecasProntas.map((peca) => (
                        <tr key={peca.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 sm:px-6 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                            {peca.sku}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                              {peca.tipo}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                            {peca.codigo_estampa}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5">{peca.cor}</td>
                          <td className="px-4 sm:px-6 py-3.5">
                            <span className="font-bold">{peca.tamanho}</span>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-slate-500">{peca.brand_name}</td>
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAjustarQtdPeca(peca.id, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className={`w-8 text-center font-bold text-sm ${peca.quantidade === 0 ? 'text-rose-500' : ''}`}>
                                {peca.quantidade}
                              </span>
                              <button
                                onClick={() => handleAjustarQtdPeca(peca.id, 1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <button
                              onClick={() => handleDeletarPeca(peca.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* ABA 3: ESTAMPAS AVULSA (INSUMO DE ESTAMPA)                    */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'estampas' && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* Action Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Estoque de Estampas Avulsas</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Estampas individuais (formato NUM-COR) estocadas para aplicação rápida sob demanda.
                </p>
              </div>
              <button
                onClick={() => {
                  setModalType('estampa');
                  setFormData({ cor: 'PRE', quantidade: 10, brand_id: brands[0]?.id || 1 });
                  setShowModal(true);
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Nova Estampa
              </button>
            </div>

            {/* Data Table Scrollable */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-4 sm:px-6 py-3.5">Código Estampa</th>
                      <th className="px-4 sm:px-6 py-3.5">Nome do Design</th>
                      <th className="px-4 sm:px-6 py-3.5">Cor</th>
                      <th className="px-4 sm:px-6 py-3.5">Marca</th>
                      <th className="px-4 sm:px-6 py-3.5">Qtd Disponível</th>
                      <th className="px-4 sm:px-6 py-3.5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {estampas.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                          Nenhuma estampa cadastrada para esta seleção.
                        </td>
                      </tr>
                    ) : (
                      estampas.map((estampa) => (
                        <tr key={estampa.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-4 sm:px-6 py-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {estampa.codigo_estampa}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-slate-900 dark:text-white font-semibold">
                            {estampa.nome_design}
                          </td>
                          <td className="px-4 sm:px-6 py-3.5">{estampa.cor}</td>
                          <td className="px-4 sm:px-6 py-3.5 text-slate-500">{estampa.brand_name}</td>
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleAjustarQtdEstampa(estampa.id, -1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold"
                              >
                                -
                              </button>
                              <span className={`w-8 text-center font-bold text-sm ${estampa.quantidade === 0 ? 'text-rose-500' : ''}`}>
                                {estampa.quantidade}
                              </span>
                              <button
                                onClick={() => handleAjustarQtdEstampa(estampa.id, 1)}
                                className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3.5 text-right">
                            <button
                              onClick={() => handleDeletarEstampa(estampa.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Deletar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL DE CADASTRO RESPONSIVO */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold">
              {modalType === 'peca' ? 'Cadastrar Peça Pronta' : 'Cadastrar Estampa Avulsa'}
            </h3>
            
            <form onSubmit={handleSalvarModal} className="space-y-3.5 text-xs font-medium">
              
              <div>
                <label className="block text-slate-500 mb-1">Marca</label>
                <select
                  value={formData.brand_id || ''}
                  onChange={(e) => setFormData({...formData, brand_id: e.target.value})}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  required
                >
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {modalType === 'peca' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">Tipo de Peça</label>
                      <select
                        value={formData.tipo || 'CM'}
                        onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                        className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                      >
                        <option value="CM">CM (Camisa Masc)</option>
                        <option value="CF">CF (Camisa Fem)</option>
                        <option value="MO">MO (Moletom)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Cód. Estampa (NUM-COR)</label>
                      <input
                        type="text"
                        placeholder="Ex: 001-PRE"
                        value={formData.codigo_estampa || ''}
                        onChange={(e) => setFormData({...formData, codigo_estampa: e.target.value.toUpperCase()})}
                        className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1">Cor</label>
                      <select
                        value={formData.cor || 'PRE'}
                        onChange={(e) => setFormData({...formData, cor: e.target.value})}
                        className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                      >
                        <option value="PRE">PRE (Preto)</option>
                        <option value="BRA">BRA (Branca)</option>
                        <option value="AMA">AMA (Amarelo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1">Tamanho</label>
                      <select
                        value={formData.tamanho || 'M'}
                        onChange={(e) => setFormData({...formData, tamanho: e.target.value})}
                        className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                      >
                        {['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'G4'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1">SKU Gerado</label>
                    <input
                      type="text"
                      placeholder="Ex: CM-001-PRE-M"
                      value={formData.sku || `${formData.tipo || 'CM'}-${formData.codigo_estampa || '001-PRE'}-${formData.tamanho || 'M'}`}
                      onChange={(e) => setFormData({...formData, sku: e.target.value.toUpperCase()})}
                      className="w-full p-2.5 sm:p-3 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase font-bold text-indigo-600 dark:text-indigo-400 text-xs"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-500 mb-1">Código Estampa (NUM-COR)</label>
                    <input
                      type="text"
                      placeholder="Ex: 005-PRE"
                      value={formData.codigo_estampa || ''}
                      onChange={(e) => setFormData({...formData, codigo_estampa: e.target.value.toUpperCase()})}
                      className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl font-mono uppercase"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Nome do Design</label>
                    <input
                      type="text"
                      placeholder="Ex: Caveira Heavy Metal"
                      value={formData.nome_design || ''}
                      onChange={(e) => setFormData({...formData, nome_design: e.target.value})}
                      className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Cor</label>
                    <select
                      value={formData.cor || 'PRE'}
                      onChange={(e) => setFormData({...formData, cor: e.target.value})}
                      className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <option value="PRE">PRE (Preto)</option>
                      <option value="BRA">BRA (Branca)</option>
                      <option value="AMA">AMA (Amarelo)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-slate-500 mb-1">Quantidade Inicial</label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantidade ?? 0}
                  onChange={(e) => setFormData({...formData, quantidade: Number(e.target.value)})}
                  className="w-full p-2.5 sm:p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20"
                >
                  Salvar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* FOOTER RESPONSIVO */}
      <footer className="border-t border-slate-200 dark:border-slate-900 py-4 sm:py-6 bg-white dark:bg-slate-950 text-[11px] sm:text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} HC_comp • Sistema de Gestão de Estoque (pt-BR)</p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 text-slate-400">
            <span>Clube Rock (cluberock.com.br)</span>
            <span className="hidden sm:inline">•</span>
            <span>Ride Nation (ridenation.com.br)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
