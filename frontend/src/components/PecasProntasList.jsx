import React from 'react';
import { Shirt } from 'lucide-react';
import ItemVariantCard from './ItemVariantCard';

export default function PecasProntasList({ pecas, onUsar, submittingId }) {
  if (!pecas || pecas.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
        <Shirt className="w-4 h-4 text-indigo-500" />
        <span>Peças Prontas ({pecas.length})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pecas.map((item) => (
          <ItemVariantCard
            key={`peca-${item.id}`}
            item={item}
            onUsar={onUsar}
            isSubmitting={submittingId === `peca-${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
