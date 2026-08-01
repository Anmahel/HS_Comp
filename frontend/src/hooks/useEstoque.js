import { useState, useEffect, useCallback } from 'react';
import { generateSku } from '../utils/sku';

export function useEstoque() {
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
  const [skuSearch, setSkuSearch] = useState('001');
  const [verificadorBrand, setVerificadorBrand] = useState('CR');
  const [verificadorCor, setVerificadorCor] = useState('TODOS');
  const [verificadorTipo, setVerificadorTipo] = useState('CM');
  const [verificacaoResult, setVerificacaoResult] = useState(null);
  const [verificando, setVerificando] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('peca'); // 'peca' | 'estampa'
  const [formData, setFormData] = useState({});

  // Double-click lock for async form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Stabilized fetch functions with cancellation support
  const fetchBrands = useCallback(async (isCancelled = () => false) => {
    try {
      const res = await fetch('/api/brands');
      if (res.ok && !isCancelled()) {
        const data = await res.json();
        if (!isCancelled()) setBrands(data);
      }
    } catch (err) {
      if (!isCancelled()) console.error('Erro ao buscar marcas:', err);
    }
  }, []);

  const fetchEstampas = useCallback(async (brandId = selectedBrand, isCancelled = () => false) => {
    try {
      const url = brandId ? `/api/estampas?brand_id=${brandId}` : '/api/estampas';
      const res = await fetch(url);
      if (res.ok && !isCancelled()) {
        const data = await res.json();
        if (!isCancelled()) setEstampas(data);
      }
    } catch (err) {
      if (!isCancelled()) console.error('Erro ao buscar estampas:', err);
    }
  }, [selectedBrand]);

  const fetchPecasProntas = useCallback(async (brandId = selectedBrand, isCancelled = () => false) => {
    try {
      const url = brandId ? `/api/pecas-prontas?brand_id=${brandId}` : '/api/pecas-prontas';
      const res = await fetch(url);
      if (res.ok && !isCancelled()) {
        const data = await res.json();
        if (!isCancelled()) setPecasProntas(data);
      }
    } catch (err) {
      if (!isCancelled()) console.error('Erro ao buscar peças prontas:', err);
    }
  }, [selectedBrand]);

  // Fetch initial data with cancellation flag
  useEffect(() => {
    let ignore = false;
    const isCancelled = () => ignore;

    fetchBrands(isCancelled);
    fetchEstampas(selectedBrand, isCancelled);
    fetchPecasProntas(selectedBrand, isCancelled);

    return () => {
      ignore = true;
    };
  }, [selectedBrand, fetchBrands, fetchEstampas, fetchPecasProntas]);

  // Execute SKU Search Verification
  const handleVerificarSKU = async (e) => {
    if (e) e.preventDefault();

    setVerificando(true);
    try {
      const url = `/api/verificar-disponibilidade?sku=${encodeURIComponent(skuSearch.trim())}&brand_prefix=${encodeURIComponent(verificadorBrand)}&cor=${encodeURIComponent(verificadorCor)}&tipo=${encodeURIComponent(verificadorTipo)}`;
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

  // Auto verify default SKU on load / brand change / filter change
  useEffect(() => {
    let ignore = false;

    const executeCheck = async () => {
      setVerificando(true);
      try {
        const url = `/api/verificar-disponibilidade?sku=${encodeURIComponent(skuSearch.trim())}&brand_prefix=${encodeURIComponent(verificadorBrand)}&cor=${encodeURIComponent(verificadorCor)}&tipo=${encodeURIComponent(verificadorTipo)}`;
        const res = await fetch(url);
        if (res.ok && !ignore) {
          const data = await res.json();
          if (!ignore) setVerificacaoResult(data);
        }
      } catch (err) {
        if (!ignore) console.error('Erro na verificação de SKU:', err);
      } finally {
        if (!ignore) setVerificando(false);
      }
    };

    executeCheck();

    return () => {
      ignore = true;
    };
  }, [skuSearch, verificadorBrand, verificadorCor, verificadorTipo]);

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

  // Modal open handlers
  const handleOpenModalPeca = () => {
    setModalType('peca');
    setFormData({ tipo: 'CM', cor: 'PRE', tamanho: 'M', quantidade: 1, brand_id: brands[0]?.id || 1 });
    setShowModal(true);
  };

  const handleOpenModalEditPeca = (peca) => {
    setModalType('peca');
    setFormData({
      id: peca.id,
      tipo: peca.tipo || 'CM',
      codigo_estampa: peca.codigo_estampa || '',
      cor: peca.cor || 'PRE',
      tamanho: peca.tamanho || 'M',
      quantidade: peca.quantidade ?? 0,
      brand_id: peca.brand_id || brands[0]?.id || 1,
      sku: peca.sku || ''
    });
    setShowModal(true);
  };

  const handleOpenModalEstampa = () => {
    setModalType('estampa');
    setFormData({ cor: 'PRE', quantidade: 10, brand_id: brands[0]?.id || 1 });
    setShowModal(true);
  };

  // Form Submission with re-entry guard
  const handleSalvarModal = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const isEditing = Boolean(formData.id);
    const endpoint = isEditing
      ? (modalType === 'peca' ? `/api/pecas-prontas/${formData.id}` : `/api/estampas/${formData.id}`)
      : (modalType === 'peca' ? '/api/pecas-prontas' : '/api/estampas');
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const calculatedSku = modalType === 'peca'
        ? generateSku(formData, brands)
        : undefined;

      const payload = {
        ...formData,
        ...(modalType === 'peca' ? { sku: calculatedSku } : {}),
        quantidade: formData.quantidade !== '' ? Math.max(0, parseInt(formData.quantidade, 10) || 0) : 0,
        brand_id: Number(formData.brand_id || brands[0]?.id || 1)
      };

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errorMsg = 'Erro ao salvar registro';
        try {
          const errData = await res.json();
          errorMsg = errData.erro || errorMsg;
        } catch (_) {}
        alert(errorMsg);
        return;
      }

      setShowModal(false);
      setFormData({});
      if (modalType === 'peca') fetchPecasProntas();
      else fetchEstampas();
      handleVerificarSKU();
    } catch (err) {
      console.error('Erro no salvamento:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Stock Consumption (Usar / Dar Baixa)
  const handleUsarEstoque = async (categoria, id, cantidad) => {
    try {
      const res = await fetch('/api/usar-estoque', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoria, id, quantidade: cantidad })
      });

      if (!res.ok) {
        let errorMsg = 'Erro ao dar baixa no estoque';
        try {
          const errData = await res.json();
          errorMsg = errData.erro || errorMsg;
        } catch (_) {}
        return { success: false, message: errorMsg };
      }

      const data = await res.json();
      fetchPecasProntas();
      fetchEstampas();
      handleVerificarSKU();
      return { success: true, message: data.mensagem };
    } catch (err) {
      console.error('Erro ao usar estoque:', err);
      return { success: false, message: 'Erro na conexão com o servidor' };
    }
  };

  return {
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    brands,
    selectedBrand,
    setSelectedBrand,
    estampas,
    pecasProntas,
    skuSearch,
    setSkuSearch,
    verificadorBrand,
    setVerificadorBrand,
    verificadorCor,
    setVerificadorCor,
    verificadorTipo,
    setVerificadorTipo,
    verificacaoResult,
    verificando,
    handleVerificarSKU,
    handleUsarEstoque,
    showModal,
    setShowModal,
    modalType,
    formData,
    setFormData,
    isSubmitting,
    handleAjustarQtdPeca,
    handleAjustarQtdEstampa,
    handleDeletarPeca,
    handleDeletarEstampa,
    handleOpenModalPeca,
    handleOpenModalEditPeca,
    handleOpenModalEstampa,
    handleSalvarModal
  };
}
