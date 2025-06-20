import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function Privacidade() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <h1>Política de Privacidade</h1>
        <p>Saiba como tratamos seus dados e garantimos sua privacidade na Pet-Joyful.</p>
        <section>
          <h2>Coleta de Informações</h2>
          <p>
            Coletamos informações pessoais fornecidas por você ao utilizar nosso site, como nome, e-mail, telefone e dados de navegação. Essas informações são utilizadas para melhorar sua experiência, processar pedidos e fornecer suporte.
          </p>
          <h2>Uso das Informações</h2>
          <p>
            Utilizamos seus dados para personalizar o atendimento, enviar comunicações relevantes, aprimorar nossos serviços e garantir a segurança do site. Não compartilhamos suas informações com terceiros sem seu consentimento, exceto quando exigido por lei.
          </p>
          <h2>Cookies</h2>
          <p>
            Utilizamos cookies para melhorar a navegação e analisar o uso do site. Você pode gerenciar ou desabilitar os cookies nas configurações do seu navegador.
          </p>
          <h2>Segurança</h2>
          <p>
            Adotamos medidas de segurança para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição.
          </p>
          <h2>Seus Direitos</h2>
          <p>
            Você pode solicitar acesso, correção ou exclusão de seus dados pessoais a qualquer momento. Para isso, entre em contato conosco.
          </p>
          <h2>Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Recomendamos que você revise esta página regularmente para estar ciente de quaisquer alterações.
          </p>
          <h2>Contato</h2>
          <p>
            Em caso de dúvidas sobre nossa política de privacidade, entre em contato pelo e-mail: contato@petjoyful.com.br
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}