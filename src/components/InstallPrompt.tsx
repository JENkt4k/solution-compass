import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installDismissed, setInstallDismissed] = useState(false);
  const [updateDismissed, setUpdateDismissed] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;

      window.setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    },
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const installedHandler = () => {
      setDeferredPrompt(null);
      setShowPrompt(false);
      setInstallDismissed(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
      setDeferredPrompt(null);
    } else {
      setInstallDismissed(true);
    }
  };

  const handleDismissUpdate = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setUpdateDismissed(true);
  };

  const handleDismissInstall = () => {
    setShowPrompt(false);
    setInstallDismissed(true);
  };

  if (needRefresh && !updateDismissed) {
    return (
      <div className="install-prompt" role="status" aria-live="polite">
        <span>New version ready</span>
        <div className="install-actions">
          <button type="button" onClick={() => updateServiceWorker(true)}>Refresh</button>
          <button className="text-button" type="button" onClick={handleDismissUpdate}>Later</button>
        </div>
      </div>
    );
  }

  if (offlineReady && !updateDismissed) {
    return (
      <div className="install-prompt" role="status" aria-live="polite">
        <span>Ready for offline use</span>
        <button type="button" onClick={handleDismissUpdate}>OK</button>
      </div>
    );
  }

  if (!showPrompt || installDismissed) return null;

  return (
    <div className="install-prompt" role="status" aria-live="polite">
      <span>Install app for offline use</span>
      <div className="install-actions">
        <button type="button" onClick={handleInstall}>Install</button>
        <button className="text-button" type="button" onClick={handleDismissInstall}>Later</button>
      </div>
    </div>
  );
}
