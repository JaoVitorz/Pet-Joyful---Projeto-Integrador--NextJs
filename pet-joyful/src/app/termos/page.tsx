import Header from "../components/common/Header";
import Footer from "../components/common/Footer";


export default function Termos() {
  return (
    <>
      <Header />
      <div className="container py-5">
        <h1>Termos de Uso</h1>
        <p>Leia atentamente nossos termos de uso antes de utilizar a plataforma Pet-Joyful.</p>
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar ou usar a plataforma Pet-Joyful, você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.
        </p>

        <h2>2. Cadastro e Conta</h2>
        <p>
          Para utilizar certas funcionalidades, é necessário criar uma conta, fornecendo informações verdadeiras e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
        </p>

        <h2>3. Uso da Plataforma</h2>
        <ul>
          <li>Não é permitido publicar conteúdo ofensivo, discriminatório, ilegal ou que viole direitos de terceiros.</li>
          <li>É proibido criar perfis falsos ou utilizar a plataforma para fins ilícitos.</li>
          <li>O compartilhamento de informações pessoais deve ser feito com cautela e é de sua responsabilidade.</li>
        </ul>

        <h2>4. Conteúdo do Usuário</h2>
        <p>
          Ao postar fotos, textos ou qualquer conteúdo, você concede à Pet-Joyful o direito de exibir esse conteúdo na plataforma. Você continua sendo o proprietário do conteúdo, mas autoriza seu uso conforme necessário para o funcionamento da rede social.
        </p>

        <h2>5. Privacidade</h2>
        <p>
          Suas informações pessoais serão tratadas conforme nossa Política de Privacidade. Recomendamos a leitura atenta desse documento.
        </p>

        <h2>6. Responsabilidades</h2>
        <ul>
          <li>A Pet-Joyful não se responsabiliza por interações entre usuários fora da plataforma.</li>
          <li>O usuário é responsável por garantir que as informações sobre seus pets estejam corretas e atualizadas.</li>
        </ul>

        <h2>7. Modificações dos Termos</h2>
        <p>
          Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. As alterações serão comunicadas na plataforma.
        </p>

        <h2>8. Contato</h2>
        <p>
          Em caso de dúvidas, entre em contato pelo e-mail suporte@petjoyful.com.
        </p>
      </div>
      <Footer />
    </>
  );
}