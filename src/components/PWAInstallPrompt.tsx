import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';
import { usePWAPrompt } from '@/hooks/use-pwa-prompt';

const PWAInstallPrompt = () => {
  const { isInstallable, installApp } = usePWAInstall();
  const { shouldShowPrompt, dismissPrompt, hidePrompt } = usePWAPrompt();

  // Verificar se é iOS Safari para mostrar instruções específicas
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const showIOSInstructions = isIOS && isSafari;

  const handleInstallClick = async () => {
    if (showIOSInstructions) {
      // Para iOS, apenas fechar o prompt
      dismissPrompt();
      return;
    }

    const success = await installApp();
    if (success) {
      hidePrompt();
    } else {
      dismissPrompt();
    }
  };

  // Mostrar o prompt se:
  // 1. Deve mostrar baseado no timing/dismissal
  // 2. É iOS Safari OU é instalável via beforeinstallprompt
  if (!shouldShowPrompt || (!showIOSInstructions && !isInstallable)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <Card className="border-2 border-primary/20 shadow-lg backdrop-blur-sm bg-background/95">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Instalar App</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={dismissPrompt}
              className="h-6 w-6 p-0 hover:bg-muted"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            {showIOSInstructions
              ? "Adicione o To Sem Banda à sua tela inicial para acesso rápido!"
              : "Instale o To Sem Banda como um app no seu dispositivo!"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {showIOSInstructions ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Para instalar:
              </p>
              <ol className="text-sm space-y-1 text-muted-foreground ml-4 list-decimal">
                <li className="flex items-center gap-2">
                  <span>Toque no ícone de compartilhar</span>
                  <Share className="h-4 w-4" />
                </li>
                <li>Selecione "Adicionar à Tela Inicial"</li>
                <li>Toque em "Adicionar"</li>
              </ol>
              <Button 
                onClick={dismissPrompt}
                className="w-full"
                variant="outline"
              >
                Entendi
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button 
                onClick={handleInstallClick}
                className="flex-1"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar
              </Button>
              <Button 
                onClick={dismissPrompt}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Agora não
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
