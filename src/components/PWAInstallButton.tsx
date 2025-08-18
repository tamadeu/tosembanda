import { Button } from '@/components/ui/button';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/use-pwa-install';

interface PWAInstallButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showIcon?: boolean;
}

const PWAInstallButton = ({ 
  variant = 'outline', 
  size = 'sm', 
  className = '', 
  showIcon = true 
}: PWAInstallButtonProps) => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  // Não mostrar se já está instalado
  if (isInstalled) {
    return null;
  }

  // Verificar se é iOS Safari para texto diferente
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
  const showIOSInstructions = isIOS && isSafari;

  const handleClick = async () => {
    if (showIOSInstructions) {
      // Para iOS, mostrar alerta com instruções
      alert('Para instalar: 1. Toque no ícone de compartilhar, 2. Selecione "Adicionar à Tela Inicial", 3. Toque em "Adicionar"');
      return;
    }

    if (!isInstallable) {
      return;
    }

    await installApp();
  };

  // Só mostrar se for instalável ou se for iOS Safari
  if (!isInstallable && !showIOSInstructions) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={className}
    >
      {showIcon && (
        showIOSInstructions ? (
          <Smartphone className="h-4 w-4 mr-2" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )
      )}
      {showIOSInstructions ? 'Adicionar à Tela' : 'Instalar App'}
    </Button>
  );
};

export default PWAInstallButton;
