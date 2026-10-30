import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Clock,
  UsersThree,
  IdentificationCard,
  CarProfile,
  ChatCircleText,
  NavigationArrow,
  SealCheck,
  CursorClick,
  Wallet,
} from "@phosphor-icons/react";
import "./ProductWalkthrough.css";
const chapters = [
  {
    title: "Encontre quem já vai.",
    body: "Escolha um ponto de saída e um horário. O que estava espalhado no grupo vira uma opção fácil de entender.",
    icon: MapPin,
  },
  {
    title: "Conheça antes de combinar.",
    body: "O perfil mostra o vínculo acadêmico e as conexões de rota. Você não precisa decidir olhando apenas um nome e uma foto.",
    icon: IdentificationCard,
  },
  {
    title: "Saia com tudo combinado.",
    body: "Depois do aceite, o chat aproxima vocês. Ponto de encontro, horário e contribuição ficam claros antes de sair.",
    icon: ChatCircleText,
  },
];
export default function ProductWalkthrough() {
  const [step, setStep] = useState(0);
  const [origin, setOrigin] = useState("Praça do bairro");
  const [time, setTime] = useState("18:20");
  const [done, setDone] = useState(false);
  function change(n: number) {
    setStep(n);
    setDone(false);
  }
  return (
    <div className="product-walkthrough">
      <div className="walkthrough-guide">
        <div className="try-caption">
          <CursorClick size={19} />
          <span>Experimente a ideia, passo a passo</span>
        </div>
        <div className="chapter-list" aria-label="Etapas da demonstração">
          {chapters.map((c, i) => (
            <button
              key={c.title}
              aria-pressed={step === i}
              onClick={() => change(i)}
              className={`chapter ${step === i ? "is-current" : ""}`}
            >
              <span className="chapter-index">
                {step > i ? (
                  <Check size={18} />
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <span>
                <strong>{c.title}</strong>
                <span className="chapter-copy">{c.body}</span>
              </span>
              {step === i && (
                <motion.span
                  layoutId="chapter-marker"
                  className="chapter-marker"
                />
              )}
            </button>
          ))}
        </div>
        <div className="walkthrough-footnote">
          <Wallet size={20} />
          <p>
            A instituição oferece o acesso.
            <br />
            <strong>A carona é combinada entre vocês.</strong>
          </p>
        </div>
      </div>
      <div className="product-device">
        <div className="device-top">
          <span className="mini-wordmark">unigo</span>
          <span className="demo-pill">EXEMPLO INTERATIVO</span>
          <span className="profile-initials">VC</span>
        </div>
        <div className="device-progress" aria-label={`Etapa ${step + 1} de 3`}>
          {chapters.map((c, i) => (
            <span key={c.title} className={i <= step ? "complete" : ""} />
          ))}
        </div>
        <div className="device-content">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
          >
            {step === 0 && (
              <>
                <span className="device-kicker">SEU PRÓXIMO TRAJETO</span>
                <h3>Vamos para a aula?</h3>
                <p className="device-subtitle">
                  O mesmo campus. Um caminho em comum.
                </p>
                <div className="demo-search">
                  <label>
                    <span>
                      <MapPin />
                      Saindo de
                    </span>
                    <select
                      aria-label="Ponto de saída do exemplo"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                    >
                      <option>Praça do bairro</option>
                      <option>Centro</option>
                      <option>Perto de casa</option>
                    </select>
                  </label>
                  <label>
                    <span>
                      <Clock />
                      Horário
                    </span>
                    <select
                      aria-label="Horário do exemplo"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    >
                      <option>18:20</option>
                      <option>18:40</option>
                      <option>19:00</option>
                    </select>
                  </label>
                </div>
                <div className="result-heading">
                  <span>Uma possibilidade para explorar</span>
                  <span>Ilustrativa</span>
                </div>
                <div className="ride-preview">
                  <div className="ride-person">
                    <span className="person-avatar">LM</span>
                    <div>
                      <strong>
                        Lucas Martins <SealCheck weight="fill" />
                      </strong>
                      <span>Engenharia · 6º período</span>
                    </div>
                    <span className="ride-price">
                      R$ 15<small>por pessoa</small>
                    </span>
                  </div>
                  <div className="ride-route">
                    <div>
                      <span className="route-dot" />
                      <strong>{time}</strong>
                      <span>{origin}</span>
                    </div>
                    <div>
                      <span className="route-dot destination" />
                      <strong>Destino</strong>
                      <span>Campus UniFio</span>
                    </div>
                  </div>
                  <div className="ride-tags">
                    <span>
                      <UsersThree />2 lugares no exemplo
                    </span>
                    <span>
                      <CarProfile />
                      Trajeto de ida
                    </span>
                  </div>
                  <button className="demo-primary" onClick={() => change(1)}>
                    Conhecer o perfil <ArrowRight />
                  </button>
                </div>
              </>
            )}
            {step === 1 && (
              <>
                <span className="device-kicker">ANTES DE IR JUNTO</span>
                <div className="profile-heading">
                  <span className="person-avatar large">LM</span>
                  <div>
                    <h3>Lucas Martins</h3>
                    <p className="device-subtitle">
                      Engenharia · 6º período · Noturno
                    </p>
                  </div>
                </div>
                <div className="verification-strip">
                  <IdentificationCard size={25} />
                  <div>
                    <strong>Vínculo acadêmico verificado</strong>
                    <span>Assim apareceria a verificação na plataforma.</span>
                  </div>
                  <Check />
                </div>
                <div className="social-proof-demo">
                  <span className="device-kicker">
                    QUEM JÁ DIVIDIU O CAMINHO
                  </span>
                  <div className="shared-people">
                    <span className="person-avatar small">BC</span>
                    <span className="person-avatar small">RF</span>
                    <div>
                      <strong>Beatriz e Rafael</strong>
                      <span>Administração e Direito</span>
                    </div>
                  </div>
                  <div className="shared-stamp">
                    <NavigationArrow weight="fill" />
                    <span>
                      Rota compartilhada
                      <small>O selo aparece após 3 caronas juntos.</small>
                    </span>
                  </div>
                </div>
                <p className="example-note">
                  Perfis e conexões fictícios para demonstrar a proposta. Não
                  são usuários cadastrados.
                </p>
                <button className="demo-primary" onClick={() => change(2)}>
                  Ver como seria o encontro <ArrowRight />
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <span className="device-kicker">
                  EXEMPLO DE CHAT APÓS O ACEITE
                </span>
                <h3>O encontro toma forma.</h3>
                <p className="device-subtitle">
                  Os detalhes saem da dúvida e entram na conversa.
                </p>
                <div className="demo-chat">
                  <span className="chat-date">CONVERSA ILUSTRATIVA</span>
                  <div className="chat-bubble incoming">
                    <small>Lucas</small>Posso te encontrar em:{" "}
                    {origin.toLowerCase()}. Às {time}, funciona?
                  </div>
                  <div className="chat-bubble outgoing">
                    Funciona! A contribuição fica R$ 15?
                  </div>
                  <div className="chat-bubble incoming">
                    Isso. A gente combina o pagamento direto, por Pix ou
                    dinheiro.
                  </div>
                </div>
                <div className="meeting-ticket">
                  <MapPin size={23} />
                  <div>
                    <strong>{origin}</strong>
                    <span>{time} · Ida para o campus</span>
                  </div>
                  <span className="ticket-edge" />
                </div>
                <button
                  className={`demo-primary ${done ? "demo-confirmed" : ""}`}
                  onClick={() => setDone(true)}
                  disabled={done}
                >
                  {done ? (
                    <>
                      <Check />
                      Exemplo concluído
                    </>
                  ) : (
                    <>
                      Simular combinado <Check />
                    </>
                  )}
                </button>
                {done && (
                  <p className="example-note" role="status">
                    Você percorreu a ideia: buscar, conhecer e combinar. Nenhuma
                    carona foi reservada.
                  </p>
                )}
              </>
            )}
          </motion.div>
        </div>
        <div className="device-bottom">
          <button
            disabled={step === 0}
            onClick={() => change(step - 1)}
            aria-label="Etapa anterior"
          >
            <ArrowLeft />
          </button>
          <span>Demonstração local · sem reserva real</span>
          <button
            disabled={step === 2}
            onClick={() => change(step + 1)}
            aria-label="Próxima etapa"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
export function TrustDetails() {
  return (
    <div className="trust-details">
      <div className="identity-pass">
        <div className="pass-top">
          <span>IDENTIDADE NA COMUNIDADE</span>
          <IdentificationCard size={25} />
        </div>
        <div className="pass-person">
          <span className="person-avatar large">BC</span>
          <div>
            <strong>Beatriz Costa</strong>
            <span>Administração · 2º período</span>
          </div>
        </div>
        <div className="pass-fields">
          <span>
            Vínculo<strong>Acadêmico</strong>
          </span>
          <span>
            Comunidade<strong>Institucional</strong>
          </span>
        </div>
        <div className="pass-footer">
          <SealCheck weight="fill" />
          R.A. verificado <span>Perfil ilustrativo</span>
        </div>
      </div>
      <div className="trust-explainer">
        <span className="eyebrow">O QUE VOCÊ CONSEGUE CONHECER</span>
        <h3>
          Mais contexto.
          <br />
          Menos adivinhação.
        </h3>
        <ul>
          <li>
            <Check />
            <div>
              <strong>De onde vem o vínculo</strong>
              <p>Curso, período e turno ajudam a reconhecer a pessoa.</p>
            </div>
          </li>
          <li>
            <Check />
            <div>
              <strong>Quem já foi junto</strong>
              <p>Conexões visíveis dão contexto ao histórico de caronas.</p>
            </div>
          </li>
          <li>
            <Check />
            <div>
              <strong>Com quem falar se precisar</strong>
              <p>Problemas podem ser reportados à instituição.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
