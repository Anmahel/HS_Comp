export function getBrandPrefix(brandId, brands = []) {
  if (!brandId && brands && brands.length > 0) {
    brandId = brands[0].id;
  }
  const brand = brands.find(b => String(b.id) === String(brandId));
  if (!brand || !brand.name) return 'CR';

  const name = brand.name.trim().toLowerCase();
  if (name.includes('clube rock') || name.includes('rock')) return 'CR';
  if (name.includes('ride nation') || name.includes('ride')) return 'RN';

  // Fallback: initials from brand name
  const initials = brand.name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0].toUpperCase())
    .join('');
  return initials || 'CR';
}

export function generateSku(formData = {}, brands = []) {
  const prefix = getBrandPrefix(formData.brand_id, brands);
  const tipo = formData.tipo || 'CM';
  const estampa = (formData.codigo_estampa || '001').trim().toUpperCase();
  const cor = formData.cor || 'PRE';
  const tamanho = formData.tamanho || 'M';

  return `${prefix}-${tipo}-${estampa}-${cor}-${tamanho}`;
}
