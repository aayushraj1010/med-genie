// src/hooks/useI18nReady.ts
import { useEffect, useState } from 'react';
import i18n from '../i18n';

export function useI18nReady() {
  const [ready, setReady] = useState(i18n.isInitialized);
  useEffect(() => {
    const onReady = () => setReady(true);
    if (!i18n.isInitialized) i18n.on('initialized', onReady);
    return () => i18n.off('initialized', onReady);
  }, []);
  return ready;
}
