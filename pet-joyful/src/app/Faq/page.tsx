import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

export default function FAQ() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <h1>FAQ - Perguntas Frequentes</h1>
        <p>Aqui você encontra respostas para as dúvidas mais comuns sobre o Pet-Joyful.</p>
        <div className="faq-list mt-4">
            <div className="faq-item mb-4">
                <h5>O que é o Pet-Joyful?</h5>
                <p>
                O Pet-Joyful é uma plataforma online dedicada a ajudar animais abandonados a encontrar novos lares, conectando pessoas interessadas em adotar pets.
                </p>
          <div className="faq-item mb-4">
            <h5>O Pet-Joyful é gratuito?</h5>
            <p>
              Sim, todas as funcionalidades básicas da plataforma são gratuitas para todos os usuários.
            </p>
          </div>
          <div className="faq-item mb-4">
            <h5>Posso adotar um animal pelo site?</h5>
            <p>
              Sim! Clique no botão adotar nas publicações feitas pela ong  e entre em contato com o responsável pelo animal.
            </p>
          </div>
          <div className="faq-item mb-4">
            <h5>Como entro em contato com o suporte?</h5>
            <p>
              Você pode enviar um e-mail para suporte@petjoyful.com ou utilizar o formulário de contato disponível no site.
            </p>
          </div>
        </div></div>
      </div>
      <Footer />
    </>
  );
}