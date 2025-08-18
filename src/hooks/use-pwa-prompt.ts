import { useState, useEffect } from 'react';

const PROMPT_DISMISS_KEY = 'pwa-prompt-dismissed';
const PROMPT_DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias em millisegundos
const PROMPT_DELAY = 3000; // 3 segundos

export const usePWAPrompt = () => {
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  useEffect(() => {
    // Verificar se o prompt foi fechado recentemente
    const checkPromptDismissal = () => {
      const dismissedTime = localStorage.getItem(PROMPT_DISMISS_KEY);
      if (dismissedTime) {
        const dismissedDate = new Date(dismissedTime);
        const now = new Date();
        return (now.getTime() - dismissedDate.getTime()) < PROMPT_DISMISS_DURATION;
      }
      return false;
    };

    // Verificar se já está instalado
    const isInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSInstalled = (window.navigator as any)?.standalone === true;
      const wasPreviouslyInstalled = localStorage.getItem('pwa-installed') === 'true';
      
      return isStandalone || isIOSInstalled || wasPreviouslyInstalled;
    };

    // Verificar se deve mostrar o prompt
    if (checkPromptDismissal() || isInstalled()) {
      return;
    }

    // Aguardar antes de mostrar o prompt
    const timer = setTimeout(() => {
      setShouldShowPrompt(true);
    }, PROMPT_DELAY);

    return () => clearTimeout(timer);
  }, []);

  const dismissPrompt = () => {
    localStorage.setItem(PROMPT_DISMISS_KEY, new Date().toISOString());
    setShouldShowPrompt(false);
  };

  const hidePrompt = () => {
    setShouldShowPrompt(false);
  };

  return {
    shouldShowPrompt,
    dismissPrompt,
    hidePrompt,
  };
};
