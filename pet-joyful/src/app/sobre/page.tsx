import React from "react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";


export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="container py-5" style={{ maxWidth: 800 }}>
        <h1>Sobre a Pet Joyful</h1>
        <p>
          Bem-vindo à Pet Joyful! Somos apaixonados por animais e dedicados a
          oferecer os melhores serviços e produtos para o bem-estar do seu pet.
        </p>
        <h2>Nossa Missão</h2>
        <p>
          Proporcionar alegria, saúde e conforto para pets e seus tutores,
          promovendo uma convivência harmoniosa e feliz.
        </p>
        <h2>O que oferecemos</h2>
        <ul>
          <li>Produtos de alta qualidade para cães e gatos</li>
          <li>Serviços de banho e tosa</li>
          <li>Atendimento veterinário especializado</li>
          <li>Dicas e conteúdos sobre cuidados com pets</li>
        </ul>
        <h2>Entre em contato</h2>
        <p>
          Ficou com alguma dúvida? <a href="/contato">Fale conosco</a>!
        </p>
      </main>
      <Footer />
    </>
  );
}
