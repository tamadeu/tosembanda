import { Layout } from "@/components/Layout";

const PrivacyPolicy = () => {
  return (
    <Layout title="Política de Privacidade">
      <div className="prose dark:prose-invert max-w-none">
        <h1>Política de Privacidade</h1>
        <p>Última atualização: 24 de Julho de 2024</p>
        
        <h2>1. Introdução</h2>
        <p>Bem-vindo ao To Sem Banda. Nós valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você usa nosso aplicativo.</p>

        <h2>2. Informações que Coletamos</h2>
        <p>Podemos coletar as seguintes informações:</p>
        <ul>
          <li><strong>Informações Pessoais:</strong> Nome, e-mail, foto de perfil, localização e outras informações que você fornece ao criar seu perfil.</li>
          <li><strong>Informações de Uso:</strong> Dados sobre como você interage com o aplicativo, como anúncios visualizados, perfis visitados e mensagens trocadas.</li>
        </ul>

        <h2>3. Como Usamos Suas Informações</h2>
        <p>Usamos as informações coletadas para:</p>
        <ul>
          <li>Fornecer, operar e manter nosso serviço.</li>
          <li>Melhorar, personalizar e expandir nosso serviço.</li>
          <li>Entender e analisar como você usa nosso serviço.</li>
          <li>Comunicar com você, seja diretamente ou através de um de nossos parceiros, incluindo para atendimento ao cliente, para fornecer atualizações e outras informações relacionadas ao serviço, e para fins de marketing e promocionais.</li>
        </ul>
        
        <h2>Contato</h2>
        <p>Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco.</p>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;