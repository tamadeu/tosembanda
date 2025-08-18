import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-black rounded-lg shadow-lg">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <div className="text-center pt-4">
              <h2 className="text-2xl font-bold">Acesse sua conta</h2>
              <p className="text-sm text-muted-foreground">
                Bem-vindo de volta!
              </p>
            </div>
            <SignInForm />
          </TabsContent>
          <TabsContent value="signup">
            <div className="text-center pt-4">
              <h2 className="text-2xl font-bold">Crie sua conta</h2>
              <p className="text-sm text-muted-foreground">
                É rápido e fácil. Vamos começar!
              </p>
            </div>
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;