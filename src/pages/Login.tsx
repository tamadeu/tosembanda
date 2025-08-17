import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se a URL contiver 'type=recovery', o componente Auth cuidará disso.
    // Não devemos redirecionar neste caso.
    if (window.location.hash.includes('type=recovery')) {
      return;
    }

    // Se houver uma sessão e não for um fluxo de recuperação,
    // o usuário já está logado, então redirecionamos para a home.
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            ou crie um cadastro para começar a se conectar
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                email_label: 'Seu email',
                password_label: 'Sua senha',
                button_label: 'Entrar',
                social_provider_text: 'Entrar com {{provider}}',
                link_text: 'Já tem uma conta? Entre',
              },
              sign_up: {
                email_label: 'Seu email',
                password_label: 'Crie uma senha',
                button_label: 'Cadastrar',
                social_provider_text: 'Cadastrar com {{provider}}',
                link_text: 'Não tem uma conta? Cadastre-se',
              },
              forgotten_password: {
                email_label: 'Seu email',
                password_label: 'Sua senha',
                button_label: 'Enviar instruções',
                link_text: 'Esqueceu sua senha?',
              },
              update_password: {
                password_label: 'Nova senha',
                password_input_placeholder: 'Sua nova senha',
                button_label: 'Salvar nova senha',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;