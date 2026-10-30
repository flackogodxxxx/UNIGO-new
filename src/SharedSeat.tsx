import { lazy, Suspense, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import {
  CarProfile,
  UsersThree,
  ArrowUpRight,
  Check,
} from "@phosphor-icons/react";
import "./SharedSeat.css";
const CarModel = lazy(() => import("./CarModel"));
const stories = {
  passenger: {
    heading: "Um lugar para você.",
    body: "Você não precisa conhecer alguém com carro antes de começar. A ideia é encontrar uma rota compatível, combinar a contribuição e saber com quem vai antes de sair.",
    steps: [
      "Encontre alguém com um trajeto parecido.",
      "Conheça quem vai com você.",
      "Combine os detalhes e vá junto.",
    ],
    label: "A próxima companhia pode estar mais perto do que você imagina.",
  },
  driver: {
    heading: "Seu caminho cabe mais gente.",
    body: "Você já ia pegar esse caminho. Ao oferecer um lugar, pode dividir os custos da viagem com alguém da sua faculdade — sem mudar de rotina para virar motorista profissional.",
    steps: [
      "Publique os lugares disponíveis.",
      "Encontre pessoas da sua comunidade.",
      "Divida os custos, sem comissão.",
    ],
    label: "O mesmo trajeto. Muito mais do que uma carona.",
  },
};
export default function SharedSeat() {
  const [role, setRole] = useState<"passenger" | "driver">("passenger");
  const ref = useRef<HTMLElement>(null);
  const near = useInView(ref, { once: true, margin: "200px" });
  const story = stories[role];
  return (
    <section id="conexoes" className="shared-seat section" ref={ref}>
      <div className="seat-intro">
        <span className="eyebrow">NÃO É SÓ UM BANCO VAZIO.</span>
        <h2>
          É espaço para
          <br />
          <span>uma nova história.</span>
        </h2>
        <p>
          Agora imagine esse trajeto na sua rotina.
          <br />
          De qual lado você começa?
        </p>
      </div>
      <div className="seat-stage">
        <div className="seat-orbit" aria-hidden="true" />
        <div
          className="seat-roles"
          role="group"
          aria-label="Escolha como participar"
        >
          <button
            aria-pressed={role === "passenger"}
            onClick={() => setRole("passenger")}
          >
            <UsersThree size={20} />
            Quero ir junto
          </button>
          <button
            aria-pressed={role === "driver"}
            onClick={() => setRole("driver")}
          >
            <CarProfile size={20} />
            Tenho lugar
          </button>
        </div>
        <div className="seat-model-wrap">
          {near && (
            <Suspense
              fallback={
                <div className="model-loading">
                  <CarProfile size={130} weight="duotone" />
                </div>
              }
            >
              <CarModel driver={role === "driver"} />
            </Suspense>
          )}
          <motion.div
            className="seat-badge"
            key={role}
            initial={{ opacity: 0, y: 15, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: -4 }}
            transition={{ duration: 0.45 }}
          >
            <span className="seat-badge-icon">
              {role === "driver" ? (
                <CarProfile size={23} />
              ) : (
                <UsersThree size={23} />
              )}
            </span>
            <span>
              {role === "driver"
                ? "Uma vaga pode aproximar."
                : "Tem espaço para você."}
              <small>Gente da mesma comunidade.</small>
            </span>
            <ArrowUpRight size={19} />
          </motion.div>
        </div>
        <div className="seat-narrative">
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0, 0, 1] }}
          >
            <h3>{story.heading}</h3>
            <p>{story.body}</p>
            <ul>
              {story.steps.map((step) => (
                <li key={step}>
                  <Check size={15} />
                  {step}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
        <p className="seat-caption" aria-live="polite">
          {story.label}
        </p>
      </div>
    </section>
  );
}
