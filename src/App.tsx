import { useEffect, useState, type ReactNode } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import {
  ArrowUpRight,
  ArrowRight,
  Plus,
  X,
  ShieldCheck,
  IdentificationCard,
  UsersThree,
  Check,
  MapPin,
} from "@phosphor-icons/react";
import * as Accordion from "@radix-ui/react-accordion";
import * as Dialog from "@radix-ui/react-dialog";
import { CampusScene } from "./StoryIllustrations";
import ProductWalkthrough, { TrustDetails } from "./ProductWalkthrough";
import SharedSeat from "./SharedSeat";
import "./App.css";
import "./illustrated-theme.css";
import "./storytelling.css";
import "./refinements.css";
import LandingNav from "./LandingNav";
import "./LandingNav.css";

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.56, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
const questions = [
  [
    "Preciso pagar para usar a UNIGO?",
    "O acesso à plataforma é um benefício oferecido pela instituição. A contribuição da carona é combinada diretamente com o motorista, por Pix ou dinheiro. A UNIGO não cobra comissão.",
  ],
  [
    "Quem pode fazer parte?",
    "Alunos, professores e colaboradores da instituição participante. A proposta prevê verificação do vínculo acadêmico; este site é uma apresentação de conceito, sem integração real com a UniFio.",
  ],
  [
    "É um aplicativo de transporte?",
    "Não. A UNIGO conecta pessoas da mesma comunidade que já fazem trajetos parecidos. Não oferece motoristas profissionais nem opera como marketplace aberto.",
  ],
  [
    "Como funciona a confiança?",
    "A proposta combina vínculo institucional, histórico de caronas e conexões de rota compartilhada. Após três viagens juntas, as pessoas recebem um selo de rota compartilhada. Vínculo não elimina riscos; problemas podem ser reportados à instituição.",
  ],
  [
    "A plataforma já está disponível?",
    "Ainda não. Esta landing apresenta o conceito e uma simulação local. Não existem reservas, pagamentos, integração acadêmica ou envio de dados nesta demonstração.",
  ],
];
function Demo({ institution = false }: { institution?: boolean }) {
  const [role, setRole] = useState("passageiro");
  const [origin, setOrigin] = useState("Ribeirão do Sul");
  const [result, setResult] = useState(false);
  return (
    <Dialog.Root onOpenChange={() => setResult(false)}>
      <Dialog.Trigger asChild>
        <button className={institution ? "button light" : "button"}>
          {institution ? "Conhecer a proposta" : "Explorar a ideia"}
          <ArrowUpRight size={19} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content className="dialog">
          <Dialog.Close className="close" aria-label="Fechar">
            <X size={24} />
          </Dialog.Close>
          <span className="eyebrow">
            {institution ? "PARA INSTITUIÇÕES" : "DEMONSTRAÇÃO LOCAL"}
          </span>
          <Dialog.Title>
            {institution
              ? "Um benefício que aproxima."
              : "Como seria o seu caminho?"}
          </Dialog.Title>
          <Dialog.Description>
            {institution
              ? "Modelo SaaS contratado pela faculdade, sem comissão sobre caronas."
              : "Explore um exemplo ilustrativo. Nenhuma carona será reservada."}
          </Dialog.Description>
          {institution ? (
            <div className="proposal">
              <p>
                <Check /> Acesso para a comunidade verificada.
              </p>
              <p>
                <Check /> Mensalidade por aluno matriculado, sob proposta.
              </p>
              <p>
                <Check /> Indicadores de economia e mobilidade previstos.
              </p>
              <p className="note">
                Conceito em validação. Sem contratação ou parceria oficial
                anunciada.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setResult(true);
              }}
            >
              <label htmlFor="origin">De onde você sairia?</label>
              <select
                id="origin"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setResult(false);
                }}
              >
                <option>Ribeirão do Sul</option>
                <option>Ourinhos</option>
                <option>Salto Grande</option>
              </select>
              <label htmlFor="role">Como você quer participar?</label>
              <select
                id="role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setResult(false);
                }}
              >
                <option value="passageiro">Quero uma carona</option>
                <option value="motorista">Tenho lugares no carro</option>
              </select>
              <button className="button" type="submit">
                Ver meu exemplo
                <ArrowRight />
              </button>
              {result && (
                <div className="demo-result" role="status">
                  <MapPin size={23} />
                  <div>
                    <strong>{origin} → UniFio</strong>
                    <p>
                      {role === "motorista"
                        ? "Você publicaria seu horário e as vagas disponíveis."
                        : "Você encontraria pessoas da comunidade com um trajeto compatível."}
                    </p>
                    <small>Exemplo fictício, sem vagas reais ou reserva.</small>
                  </div>
                </div>
              )}
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function App() {
  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    const frame = requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <>
      <motion.div className="reading-progress" style={{ scaleX: progress }} />
      <LandingNav />
      <main id="inicio">
        <section className="hero">
          <div className="hero-copy">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.56, ease: [0.2, 0, 0, 1] }}
            >
              <span className="eyebrow">
                A VIDA UNIVERSITÁRIA COMEÇA ANTES DA AULA.
              </span>
              <h1>
                O futuro é seu.
                <br />O caminho é <span>nosso.</span>
              </h1>
              <p>
                Antes de pensar na prova, você precisa pensar em como chegar. A
                UNIGO aproxima você de quem já vai para a UniFio — para dividir
                o trajeto, não adiar seus planos.
              </p>
              <div className="hero-actions">
                <Demo />
                <a className="text-link" href="#caminho">
                  Entenda como funciona
                  <ArrowRight size={18} />
                </a>
              </div>
              <div className="hero-signals">
                <span>
                  <IdentificationCard size={16} />
                  Comunidade verificada
                </span>
                <span>
                  <UsersThree size={16} />
                  Caronas entre pessoas do campus
                </span>
                <span>
                  <Check size={16} />
                  Sem comissão
                </span>
              </div>
            </motion.div>
          </div>
          <div className="hero-campus-wrap">
            <CampusScene />
            <a className="campus-invite" href="#jornada">
              <span className="invite-avatars">
                <span>Você</span>
                <span>
                  <UsersThree size={19} />
                </span>
              </span>
              <span>
                <strong>O encontro começa aqui.</strong>
                <small>Veja uma carona acontecer, passo a passo.</small>
              </span>
              <ArrowUpRight size={20} />
            </a>
          </div>
          <div className="hero-bottom">
            <span>MOBILIDADE UNIVERSITÁRIA, FEITA DE GENTE.</span>
            <span>
              Uma ideia para a comunidade UniFio
              <ArrowDownDecoration />
            </span>
          </div>
        </section>
        <section className="intro section" id="caminho">
          <Reveal>
            <span className="eyebrow">01 / ANTES DE SAIR</span>
            <h2>
              A mochila está pronta.
              <br />E a <span>carona?</span>
            </h2>
          </Reveal>
          <Reveal className="intro-aside">
            <p>
              Imagine o fim da tarde: material separado, aula chegando e você
              ainda procurando uma forma de ir. Mais uma mensagem no grupo. Mais
              uma conta para fechar.
            </p>
            <p>
              Enquanto isso, alguém da sua faculdade pega a chave do carro. Vai
              pelo mesmo caminho. Tem um banco vazio. Falta vocês se
              encontrarem.
            </p>
            <a href="#jornada" className="text-link">
              É aqui que a rota muda
              <ArrowRight size={19} />
            </a>
          </Reveal>
          <Reveal className="story-turn">
            <span className="story-turn-label">
              É essa conversa que queremos mudar.
            </span>
            <div className="story-before">
              <small>Da dúvida de todo dia</small>
              <p>“Como eu vou hoje?”</p>
            </div>
            <ArrowRight
              className="story-turn-arrow"
              size={30}
              aria-hidden="true"
            />
            <div className="story-after">
              <small>Para um encontro combinado</small>
              <p>“A gente se encontra onde?”</p>
            </div>
          </Reveal>
        </section>
        <section className="journey section" id="jornada">
          <Reveal className="journey-heading">
            <span className="eyebrow">02 / OS CAMINHOS SE ENCONTRAM</span>
            <h2>
              Não falta um caminho.
              <br />
              Falta encontrar quem já vai.
            </h2>
            <p>
              A ideia é simples: reunir trajeto, horário e gente da sua
              faculdade no mesmo lugar.
            </p>
          </Reveal>
          <ProductWalkthrough />
        </section>
        <section className="trust section" id="confianca">
          <Reveal className="trust-title">
            <span className="eyebrow">
              03 / NA PRÓXIMA VEZ, JÁ NÃO É UM DESCONHECIDO
            </span>
            <ShieldCheck size={40} weight="light" />
            <h2>
              Não é qualquer pessoa.
              <br />É gente da sua <span>comunidade.</span>
            </h2>
            <p>
              Talvez vocês nunca tenham dividido uma sala. Mas já dividem uma
              instituição. A proposta parte desse vínculo, não de estrelinhas.
            </p>
          </Reveal>
          <TrustDetails />
          <div className="trust-grid">
            <Reveal className="trust-feature">
              <IdentificationCard size={32} />
              <h3>Antes da primeira carona, um vínculo.</h3>
              <p>
                A proposta começa na verificação do vínculo acadêmico. Quem
                entra faz parte da mesma comunidade.
              </p>
            </Reveal>
            <Reveal className="trust-feature">
              <UsersThree size={32} />
              <h3>Depois de três, uma rota em comum.</h3>
              <p>
                Depois de três caronas juntos, um selo torna essa conexão
                visível nos perfis. Você pode conhecer quem já fez aquele
                caminho com a mesma pessoa.
              </p>
            </Reveal>
          </div>
          <Reveal className="newcomer">
            <span className="new-badge">
              <ShieldCheck weight="fill" />
              CALOUROS TAMBÉM TÊM LUGAR
            </span>
            <p>Novo por aqui? Seu vínculo vem antes do seu histórico.</p>
            <span>
              O selo de calouro verificado está previsto para os primeiros 30
              dias.
            </span>
          </Reveal>
        </section>
        <SharedSeat />
        <section className="institution section" id="instituicao">
          <Reveal>
            <span className="eyebrow">
              04 / CHEGAR TAMBÉM FAZ PARTE DE PERMANECER
            </span>
            <h2>
              Uma cadeira vazia
              <br />
              nem sempre é falta de vontade.
            </h2>
            <p>
              Quando o trajeto pesa no orçamento, continuar estudando fica mais
              difícil. A UNIGO propõe que a faculdade ofereça a conexão entre
              caronas como benefício: acesso para a comunidade, contribuição
              direta ao motorista e dados para entender onde a mobilidade
              precisa melhorar.
            </p>
            <Demo institution />
          </Reveal>
          <div className="institution-foot">
            <span>
              <Check /> Contratação institucional
            </span>
            <span>
              <Check /> Sem comissão por viagem
            </span>
            <span>
              <Check /> Impacto que pode ser medido
            </span>
          </div>
        </section>
        <section className="faq section">
          <Reveal>
            <h2>
              Antes de pegar
              <br />
              esse caminho.
            </h2>
            <p>Algumas respostas para começar.</p>
          </Reveal>
          <Accordion.Root type="single" collapsible className="accordion">
            {questions.map(([q, a], i) => (
              <Accordion.Item
                value={String(i)}
                key={q}
                className="accordion-item"
              >
                <Accordion.Header>
                  <Accordion.Trigger>
                    {q}
                    <Plus size={20} />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                  <p>{a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </section>
        <section className="closing section">
          <Reveal>
            <p>
              Que a próxima pergunta seja sobre a aula. Não sobre como chegar.
            </p>
            <h2>
              Vamos <span>juntos?</span>
              <ArrowUpRight weight="light" />
            </h2>
            <Demo />
          </Reveal>
        </section>
      </main>
      <footer>
        <a className="wordmark" href="#inicio">
          unigo
        </a>
        <p>Sua próxima carona começa na UniFio.</p>
        <span>
          Conceito independente em validação.
          <br />
          Sem vínculo oficial anunciado com a UniFio.
        </span>
      </footer>
    </>
  );
}
function ArrowDownDecoration() {
  return <span aria-hidden="true">↘</span>;
}
export default App;
