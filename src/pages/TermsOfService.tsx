import { Layout } from "@/components/Layout";

const TermsOfService = () => {
  return (
    <Layout title="Termos de Uso">
      <div className="prose dark:prose-invert max-w-none">
        <h1>Termos de Uso</h1>
        <p>Última atualização: 24 de Julho de 2024</p>
        
        <h2>1. Aceitação dos Termos</h2>
        <p>Ao acessar e usar o aplicativo To Sem Banda, você aceita e concorda em ficar vinculado aos termos e disposições deste acordo. Além disso, ao usar estes serviços específicos, você estará sujeito a quaisquer diretrizes ou regras postadas aplicáveis a tais serviços.</p>

        <h2>2. Conduta do Usuário</h2>
        <p>Você concorda em não usar o serviço para:</p>
        <ul>
          <li>Publicar qualquer conteúdo que seja ilegal, prejudicial, ameaçador, abusivo, assediante, difamatório, vulgar, obsceno ou odioso.</li>
          <li>Personificar qualquer pessoa ou entidade.</li>
          <li>Violar qualquer lei local, estadual, nacional ou internacional aplicável.</li>
        </ul>

        <h2>3. Rescisão</h2>
        <p>Reservamo-nos o direito de suspender ou encerrar sua conta e recusar todo e qualquer uso atual ou futuro do serviço por qualquer motivo, a qualquer momento.</p>

        <h2>Contato</h2>
        <p>Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco.</p>
      </div>
    </Layout>
  );
};

export default TermsOfService;