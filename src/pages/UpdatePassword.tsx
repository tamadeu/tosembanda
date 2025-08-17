import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const UpdatePassword = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Atualize sua senha
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Digite sua nova senha abaixo.
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          view="update_password"
          theme="dark"
          localization={{
            variables: {
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

export default UpdatePassword;