import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import PWAInstallButton from "@/components/PWAInstallButton";

const Settings = () => {
  return (
    <Layout title="Configurações">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-select">Tema</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme-select" className="w-[180px]">
                  <SelectValue placeholder="Selecione o tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Padrão do Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>Escolha quais notificações você quer receber.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="profile-view-notification">Alguém visitou meu perfil</Label>
              <Switch id="profile-view-notification" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="new-message-notification">Nova mensagem no chat</Label>
              <Switch id="new-message-notification" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>App</CardTitle>
            <CardDescription>Configurações do aplicativo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Instalar como App</Label>
                <p className="text-sm text-muted-foreground">Tenha acesso rápido direto da sua tela inicial</p>
              </div>
              <PWAInstallButton variant="default" size="sm" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre</CardTitle>
            <CardDescription>Informações sobre o aplicativo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <Link to="/privacy-policy" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Política de Privacidade</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Separator />
                <Link to="/terms-of-service" className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                    <span>Termos de Uso</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
                <Separator />
                <div className="flex items-center justify-between p-2">
                    <span className="text-sm">Versão do App</span>
                    <span className="text-sm text-muted-foreground">1.0.0</span>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;