import React from 'react';
import { Flame, Compass, Tag } from 'lucide-react';

export default function BrandBadge({ brandName }) {
  if (!brandName) return null;

  const normalized = brandName.trim().toLowerCase();

  if (normalized.includes('clube rock') || normalized.includes('rock') || normalized === 'cr') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 font-extrabold text-[11px] tracking-wide uppercase shadow-xs">
        <Flame className="w-3 h-3 text-red-500 fill-red-500/20" />
        CR
      </span>
    );
  }

  if (normalized.includes('ride nation') || normalized.includes('ride') || normalized === 'rn') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 border border-slate-700 dark:border-slate-300 font-black text-[10px] tracking-wider uppercase shadow-xs">
        <Compass className="w-3 h-3 text-slate-300 dark:text-slate-700" />
        RN
      </span>
    );
  }

  const shortName = brandName
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join('') || brandName.slice(0, 3).toUpperCase();

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
      <Tag className="w-3 h-3 text-slate-400" />
      {shortName}
    </span>
  );
}
