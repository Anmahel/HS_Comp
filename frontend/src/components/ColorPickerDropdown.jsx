import React, { useState } from 'react';

const COLOR_OPTIONS = [
  { id: 'PRE', label: 'PRE (Preto)', style: 'bg-black text-white border-slate-700 font-bold' },
  { id: 'AMA', label: 'AMA (Amarelo)', style: 'bg-yellow-400 text-slate-900 font-bold shadow-[0_0_12px_rgba(250,204,21,0.5)]' },
  { id: 'BRA', label: 'BRA (Branco)', style: 'bg-white text-slate-900 border-slate-300 font-bold' },
];

export default function ColorPickerDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const activeColor = COLOR_OPTIONS.find(c => c.id === value) || COLOR_OPTIONS[0];

  return (
    <div className="relative text-left w-full">
      <label htmlFor="color-picker-toggle-btn" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
        Cor
      </label>
      <button
        id="color-picker-toggle-btn"
        type="button"
        aria-label={`Cor selecionada: ${activeColor.label}. Clique para alterar.`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold transition-colors flex items-center justify-between shadow-sm ${activeColor.style}`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full border border-black/20" />
          <span>Cor: {activeColor.label}</span>
        </div>
        <span className="text-[10px] opacity-70">▼</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-30 space-y-1">
          {COLOR_OPTIONS.map(c => (
            <button
              key={c.id}
              type="button"
              aria-label={`Selecionar cor ${c.label}`}
              onClick={() => {
                onChange(c.id);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-between ${c.style} ${
                value === c.id ? 'ring-2 ring-indigo-500' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <span>{c.label}</span>
              {value === c.id && <span className="text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
