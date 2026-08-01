import React from 'react';
import { Layers } from 'lucide-react';
import ItemVariantCard from './ItemVariantCard';

export default function EstampasAvulsasList({ estampas, onUsar, submittingId }) {
  if (!estampas || estampas.length === 0) return null;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider px-1">
        <Layers className="w-4 h-4 text-amber-500" />
        <span>Estampas Avulsas ({estampas.length})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {estampas.map((item) => (
          <ItemVariantCard
            key={`estampa-${item.id}`}
            item={item}
            onUsar={onUsar}
            isSubmitting={submittingId === `estampa-${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
