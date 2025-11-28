export function getPublicEnv(key) {
  const viteEnv = import.meta?.env?.[key];
  if (viteEnv !== undefined && viteEnv !== null && viteEnv !== '') {
    console.log('[env] using import.meta.env for', key);
    return viteEnv;
  }
  const winEnv = typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key];
  if (winEnv !== undefined && winEnv !== null && winEnv !== '') {
    console.log('[env] using window.__ENV__ for', key);
    return winEnv;
  }
  const globalEnv = typeof window !== 'undefined' && window[key];
  if (globalEnv !== undefined && globalEnv !== null && globalEnv !== '') {
    console.log('[env] using window global for', key);
    return globalEnv;
  }
  console.error('[env] missing key', key);
  return undefined;
}

export function requirePublicEnv(keys) {
  const values = {};
  for (const k of keys) {
    values[k] = getPublicEnv(k);
  }
  const missing = Object.entries(values).filter(([_, v]) => v === undefined);
  if (missing.length) {
    console.error('[env] missing keys', missing.map(([k]) => k).join(', '));
  }
  return values;
}
