import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  MapTrifold,
  CarProfile,
  ChatCircleText,
  UserCircle,
  Plus,
  SignOut,
  ArrowRight,
  MapPin,
  Clock,
  UsersThree,
  Check,
  SealCheck,
  X,
  NavigationArrow,
  CalendarBlank,
  Repeat,
  PaperPlaneTilt,
} from "@phosphor-icons/react";
import {
  load,
  availableSeats,
  places,
  today,
  storageKey,
  money,
  type Ride,
  type Request as RideRequest,
} from "./model";
import "./Workspace.css";
import PriceReference from "./PriceReference";
const RideMap = lazy(() => import("./RideMap"));
type Tab = "explore" | "trips" | "messages" | "profile";
export default function Workspace() {
  const [data, setData] = useState(load),
    [tab, setTab] = useState<Tab>("explore"),
    [role, setRole] = useState<"passenger" | "driver">("passenger");
  const [origin, setOrigin] = useState(""),
    [date, setDate] = useState(today),
    [time, setTime] = useState(""),
    [selected, setSelected] = useState("demo-0"),
    [detail, setDetail] = useState<string | null>(null),
    [publish, setPublish] = useState(false),
    [notice, setNotice] = useState(""),
    [chatId, setChatId] = useState(""),
    [draft, setDraft] = useState("");
  useEffect(() => {
    document.title = "Seu caminho | UNIGO";
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch {
      const timer = window.setTimeout(
        () =>
          setNotice(
            "Não foi possível salvar neste navegador. Os dados durarão somente nesta visita.",
          ),
        0,
      );
      return () => window.clearTimeout(timer);
    }
  }, [data]);
  const available = useMemo(
    () =>
      data.rides.map((r) => ({
        ...r,
        seats: availableSeats(r, data.requests, date),
      })),
    [data.rides, data.requests, date],
  );
  const filtered = useMemo(
    () =>
      available.filter(
        (r) =>
          r.seats > 0 &&
          (!origin || r.origin === origin) &&
          (r.recurring
            ? r.date <= date &&
              ![0, 6].includes(new Date(date + "T12:00").getDay())
            : r.date === date) &&
          (!time || r.time >= time),
      ),
    [available, origin, date, time],
  );
  const ride = available.find((r) => r.id === detail);
  const pending =
    ride &&
    data.requests.find(
      (r) =>
        r.rideId === ride.id &&
        (r.date || ride.date) === date &&
        !["cancelled"].includes(r.status),
    );
  const conversations = data.requests.filter(
    (r) => r.status === "accepted" || r.status === "completed",
  );
  const chat = conversations.find((r) => r.id === chatId) || conversations[0];
  const chatRide = data.rides.find((r) => r.id === chat?.rideId);
  function request(r: Ride) {
    if (
      r.own ||
      r.seats < 1 ||
      data.requests.some(
        (q) =>
          q.rideId === r.id &&
          (q.date || r.date) === date &&
          !["cancelled"].includes(q.status),
      )
    )
      return;
    setData({
      ...data,
      requests: [
        ...data.requests,
        {
          id: crypto.randomUUID(),
          rideId: r.id,
          date,
          status: "pending",
          messages: [],
        },
      ],
    });
    setNotice(
      "Solicitação registrada localmente. Troque para motorista para simular a resposta.",
    );
    setDetail(null);
    setTab("trips");
  }
  function update(id: string, status: RideRequest["status"]) {
    setData((current) => {
      const q = current.requests.find((r) => r.id === id),
        r = current.rides.find((r) => r.id === q?.rideId);
      if (!q || !r) return current;
      const transitions: Record<
        RideRequest["status"],
        RideRequest["status"][]
      > = {
        pending: ["accepted", "cancelled"],
        accepted: ["completed", "cancelled"],
        completed: [],
        cancelled: [],
      };
      if (!transitions[q.status].includes(status)) return current;
      if (
        status === "accepted" &&
        (q.status !== "pending" ||
          availableSeats(r, current.requests, q.date || r.date) < 1)
      )
        return current;
      return {
        ...current,
        requests: current.requests.map((x) =>
          x.id === id ? { ...x, status } : x,
        ),
      };
    });
    setNotice(
      status === "accepted"
        ? "Aceite simulado. A conversa está disponível."
        : status === "completed"
          ? "Carona marcada como concluída nesta demonstração."
          : "Solicitação cancelada nesta demonstração.",
    );
  }
  function feedback(id: string, value: string) {
    setData({
      ...data,
      requests: data.requests.map((r) =>
        r.id === id ? { ...r, feedback: value } : r,
      ),
    });
    setNotice(
      value === "Tudo certo"
        ? "Feedback salvo neste navegador."
        : "Relato salvo apenas nesta demonstração. Não foi enviado à instituição.",
    );
  }
  return (
    <div className="ua">
      <aside className="ua-sidebar">
        <a href="/" className="ua-brand">
          unigo<span>comunidade em movimento</span>
        </a>
        <div className="ua-community">
          <span className="ua-community-icon">
            <BuildingsIcon />
          </span>
          <div>
            <strong>Comunidade UniFio</strong>
            <small>Ambiente demonstrativo</small>
          </div>
        </div>
        <nav aria-label="Navegação do aplicativo">
          {(
            [
              { id: "explore", label: "Encontrar carona", icon: MapTrifold },
              { id: "trips", label: "Minhas caronas", icon: CarProfile },
              { id: "messages", label: "Mensagens", icon: ChatCircleText },
              { id: "profile", label: "Meu perfil", icon: UserCircle },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              aria-current={tab === id ? "page" : undefined}
              onClick={() => {
                setTab(id);
                setNotice("");
              }}
            >
              <Icon size={21} />
              <span>{label}</span>
              {id === "trips" &&
                data.requests.filter((q) => q.status === "pending").length >
                  0 && (
                  <b>
                    {data.requests.filter((q) => q.status === "pending").length}
                  </b>
                )}
            </button>
          ))}
        </nav>
        <div className="ua-sidebar-bottom">
          <p>
            O mesmo campus.
            <br />
            <strong>Um caminho em comum.</strong>
          </p>
          <a href="/entrar">
            <SignOut size={18} />
            Sair da demonstração
          </a>
        </div>
      </aside>
      <div className="ua-body">
        <header className="ua-header">
          <div>
            <span className="ua-eyebrow">BEM-VINDO À SUA COMUNIDADE</span>
            <strong>
              Olá, Alex <span>Vamos juntos?</span>
            </strong>
          </div>
          <div className="ua-header-actions">
            <label className="ua-role">
              <span>Estou como</span>
              <select
                aria-label="Perfil de demonstração"
                value={role}
                onChange={(e) => setRole(e.target.value as typeof role)}
              >
                <option value="passenger">Passageiro</option>
                <option value="driver">Motorista</option>
              </select>
            </label>
            <button
              className="ua-primary ua-publish"
              aria-label="Oferecer carona"
              onClick={() => {
                setRole("driver");
                setPublish(true);
              }}
            >
              <Plus size={18} />
              <span>Oferecer carona</span>
            </button>
            <button
              className="ua-avatar"
              aria-label="Abrir meu perfil"
              onClick={() => setTab("profile")}
            >
              AL
            </button>
          </div>
        </header>
        <div className="ua-demo-bar">
          <span>
            <span className="ua-demo-dot" />
            Demonstração local
          </span>
          <p>Pessoas, vagas e conversas fictícias. Nenhuma reserva real.</p>
        </div>
        {notice && (
          <div className="ua-notice" role="status">
            <Check size={18} />
            <span>{notice}</span>
            <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
              <X size={17} />
            </button>
          </div>
        )}
        <main className="ua-main">
          {tab === "explore" && (
            <>
              <div className="ua-page-title">
                <div>
                  <span className="ua-eyebrow">SEU PRÓXIMO ENCONTRO</span>
                  <h1>Tem alguém indo pelo seu caminho.</h1>
                  <p>
                    Encontre uma carona para o campus, com gente da sua
                    comunidade.
                  </p>
                </div>
                <span className="ua-campus-tag">
                  <SealCheck size={18} />
                  Vínculo institucional
                </span>
              </div>
              <div className="ua-filters">
                <label>
                  <span>
                    <MapPin size={16} />
                    Saindo de
                  </span>
                  <select
                    aria-label="Filtrar origem"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  >
                    <option value="">Todos os pontos</option>
                    {Array.from(new Set(data.rides.map((r) => r.origin))).map(
                      (o) => (
                        <option key={o}>{o}</option>
                      ),
                    )}
                  </select>
                </label>
                <label>
                  <span>
                    <CalendarBlank size={16} />
                    Dia da carona
                  </span>
                  <input
                    aria-label="Dia da carona"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value || today())}
                  />
                </label>
                <label>
                  <span>
                    <Clock size={16} />A partir de
                  </span>
                  <input
                    aria-label="Horário mínimo"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </label>
                <button
                  className="ua-text-button"
                  onClick={() => {
                    setOrigin("");
                    setTime("");
                    setDate(today());
                  }}
                >
                  Limpar filtros
                </button>
              </div>
              <div className="ua-discovery">
                <section
                  className="ua-results"
                  aria-label="Caronas disponíveis"
                >
                  <div className="ua-result-title">
                    <strong>
                      {filtered.length}{" "}
                      {filtered.length === 1
                        ? "possibilidade"
                        : "possibilidades"}
                    </strong>
                    <span>Para o campus</span>
                  </div>
                  {filtered.length === 0 ? (
                    <Empty
                      title="Ainda não há uma rota para esse filtro."
                      text="Experimente outro horário ou veja todos os pontos de saída."
                    />
                  ) : (
                    filtered.map((r) => (
                      <article
                        className={`ua-ride ${selected === r.id ? "is-selected" : ""}`}
                        key={r.id}
                      >
                        <button
                          className="ua-ride-person"
                          onClick={() => {
                            setSelected(r.id);
                            setDetail(r.id);
                          }}
                        >
                          <span className="ua-avatar">
                            {r.driver
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <span>
                            <strong>
                              {r.driver}
                              <SealCheck size={15} />
                            </strong>
                            <small>{r.course}</small>
                          </span>
                          <span className="ua-price">
                            {money(r.price)}
                            <small>por pessoa</small>
                          </span>
                        </button>
                        <div className="ua-ride-route">
                          <span>
                            <i />
                            {r.origin}
                          </span>
                          <span>
                            <i />
                            Campus UniFio
                          </span>
                        </div>
                        <div className="ua-ride-meta">
                          <span>
                            <Clock size={15} />
                            {r.time}
                          </span>
                          <span>
                            <UsersThree size={15} />
                            {r.seats} {r.seats === 1 ? "lugar" : "lugares"}
                          </span>
                          {r.recurring && (
                            <span>
                              <Repeat size={15} />
                              Dias úteis
                            </span>
                          )}
                        </div>
                        <div className="ua-ride-actions">
                          <button
                            className="ua-text-button"
                            onClick={() => setSelected(r.id)}
                          >
                            Ver no mapa
                          </button>
                          <button
                            className="ua-secondary"
                            onClick={() => setDetail(r.id)}
                          >
                            Ver carona <ArrowRight size={16} />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </section>
                <Suspense
                  fallback={
                    <div className="ua-map-loading" role="status">
                      Preparando o mapa…
                    </div>
                  }
                >
                  <RideMap
                    rides={filtered}
                    selected={selected}
                    onSelect={(id) => {
                      setSelected(id);
                      setDetail(id);
                    }}
                  />
                </Suspense>
              </div>
            </>
          )}
          {tab === "trips" && (
            <>
              <PageTitle
                title={
                  role === "driver"
                    ? "Quem vai com você?"
                    : "Seus próximos encontros."
                }
                text={
                  role === "driver"
                    ? "Analise pedidos no modo de simulação. O aceite libera a conversa."
                    : "Acompanhe solicitações, combinações e o histórico do seu caminho."
                }
              />
              {data.requests.length === 0 && (
                <Empty
                  title="Seu primeiro encontro ainda está por vir."
                  text="Encontre uma rota e solicite uma vaga para experimentar o fluxo."
                  action={() => setTab("explore")}
                />
              )}
              <div className="ua-trip-list">
                {data.requests.map((q) => {
                  const r = data.rides.find((x) => x.id === q.rideId);
                  if (!r) return null;
                  return (
                    <article className="ua-trip" key={q.id}>
                      <div>
                        <span className={`ua-status ${q.status}`}>
                          {
                            {
                              pending: "Aguardando aceite",
                              accepted: "Confirmada · demo",
                              cancelled: "Cancelada",
                              completed: "Concluída",
                            }[q.status]
                          }
                        </span>
                        <h2>
                          {r.origin} <ArrowRight size={18} /> UniFio
                        </h2>
                        <p>
                          {(q.date || r.date).split("-").reverse().join("/")} ·{" "}
                          {r.time} · {r.driver} · {money(r.price)}
                        </p>
                      </div>
                      <div className="ua-trip-actions">
                        {q.status === "pending" && role === "driver" && (
                          <button
                            className="ua-primary"
                            onClick={() => update(q.id, "accepted")}
                          >
                            Simular aceite
                          </button>
                        )}
                        {["pending", "accepted"].includes(q.status) && (
                          <button
                            className="ua-secondary"
                            onClick={() => update(q.id, "cancelled")}
                          >
                            Cancelar solicitação
                          </button>
                        )}
                        {q.status === "accepted" && (
                          <>
                            <button
                              className="ua-primary"
                              onClick={() => {
                                setChatId(q.id);
                                setTab("messages");
                              }}
                            >
                              Abrir conversa
                            </button>
                            <button
                              className="ua-secondary"
                              onClick={() => update(q.id, "completed")}
                            >
                              Concluir demo
                            </button>
                          </>
                        )}
                        {q.status === "completed" && !q.feedback && (
                          <>
                            <button
                              className="ua-secondary"
                              onClick={() => feedback(q.id, "Tudo certo")}
                            >
                              Rolou tranquilo
                            </button>
                            <select
                              aria-label="Relatar problema"
                              defaultValue=""
                              onChange={(e) => feedback(q.id, e.target.value)}
                            >
                              <option value="" disabled>
                                Tive um problema
                              </option>
                              <option>Atraso</option>
                              <option>Não comparecimento</option>
                              <option>Direção perigosa</option>
                              <option>Comportamento inadequado</option>
                              <option>Cobrança divergente</option>
                            </select>
                          </>
                        )}
                        {q.feedback && (
                          <span className="ua-feedback">
                            Feedback: {q.feedback}
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
              {role === "driver" && (
                <div className="ua-own-rides">
                  <h2>Suas caronas publicadas</h2>
                  {data.rides.filter((r) => r.own).length === 0 ? (
                    <p>
                      Você ainda não publicou. Use “Oferecer carona” para
                      começar.
                    </p>
                  ) : (
                    data.rides
                      .filter((r) => r.own)
                      .map((r) => (
                        <p key={r.id}>
                          {r.origin} · {r.time} · {r.seats} vagas ·{" "}
                          {money(r.price)}
                        </p>
                      ))
                  )}
                </div>
              )}
            </>
          )}
          {tab === "messages" && (
            <>
              <PageTitle
                title="O encontro começa na conversa."
                text="O chat fica disponível somente depois do aceite. Mensagens ficam neste navegador."
              />
              {!chat ? (
                <Empty
                  title="Ainda não há conversas liberadas."
                  text="Depois de solicitar uma vaga, alterne para motorista e simule o aceite em Minhas caronas."
                  action={() => setTab("trips")}
                />
              ) : (
                <div className="ua-chat-layout">
                  <div className="ua-chat-list">
                    {conversations.map((q) => (
                      <button
                        key={q.id}
                        className={chat.id === q.id ? "active" : ""}
                        onClick={() => {
                          setChatId(q.id);
                          setDraft("");
                        }}
                      >
                        <ChatCircleText size={20} />
                        <span>
                          {data.rides.find((r) => r.id === q.rideId)?.driver}
                          <small>Combinar o trajeto</small>
                        </span>
                      </button>
                    ))}
                  </div>
                  <section className="ua-chat">
                    <div className="ua-chat-head">
                      <span className="ua-avatar">
                        {role === "driver"
                          ? "AL"
                          : chatRide?.driver.slice(0, 1)}
                      </span>
                      <div>
                        <strong>
                          {role === "driver"
                            ? "Alex · passageiro demonstrativo"
                            : chatRide?.driver}
                        </strong>
                        <small>
                          {chatRide?.origin} · {chatRide?.time}
                        </small>
                      </div>
                      <span className="ua-status accepted">
                        Aceite simulado
                      </span>
                    </div>
                    <div className="ua-messages" aria-live="polite">
                      <p className="ua-chat-system">
                        Combinem ponto de encontro e contribuição. A UNIGO não
                        intermedeia pagamentos.
                      </p>
                      {chat.messages.length === 0 && (
                        <p className="ua-chat-placeholder">
                          Comece com um “oi” e confirme onde vocês vão se
                          encontrar.
                        </p>
                      )}
                      {chat.messages.map((m, i) => (
                        <div
                          key={i}
                          className={`ua-bubble ${m.from === "you" ? "self" : ""}`}
                        >
                          <small>
                            {m.from === "you" ? "Alex" : chatRide?.driver}
                          </small>
                          {m.text}
                        </div>
                      ))}
                    </div>
                    <form
                      className="ua-compose"
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!draft.trim()) return;
                        setData({
                          ...data,
                          requests: data.requests.map((q) =>
                            q.id === chat.id
                              ? {
                                  ...q,
                                  messages: [
                                    ...q.messages,
                                    {
                                      from:
                                        role === "driver" ? "driver" : "you",
                                      text: draft.trim().slice(0, 1000),
                                    },
                                  ],
                                }
                              : q,
                          ),
                        });
                        setDraft("");
                      }}
                    >
                      <input
                        aria-label="Mensagem"
                        placeholder="Combine os detalhes…"
                        maxLength={1000}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                      />
                      <button
                        className="ua-primary"
                        aria-label="Enviar mensagem"
                        disabled={!draft.trim()}
                      >
                        <PaperPlaneTilt size={20} />
                      </button>
                    </form>
                  </section>
                </div>
              )}
            </>
          )}
          {tab === "profile" && (
            <>
              <PageTitle
                title="Seu vínculo vem antes do histórico."
                text="Perfil demonstrativo. Nenhum dado foi validado pela instituição."
              />
              <div className="ua-profile-grid">
                <section className="ua-profile-card">
                  <span className="ua-avatar large">AL</span>
                  <h2>Alex Lima</h2>
                  <p>Sistemas de Informação · 1º período</p>
                  <span className="ua-status accepted">
                    <SealCheck size={16} />
                    Novo na UNIGO · vínculo simulado
                  </span>
                  <dl>
                    <div>
                      <dt>Comunidade</dt>
                      <dd>UniFio</dd>
                    </div>
                    <div>
                      <dt>Turno</dt>
                      <dd>Noturno</dd>
                    </div>
                    <div>
                      <dt>Bairro de exemplo</dt>
                      <dd>Centro de Ourinhos</dd>
                    </div>
                    <div>
                      <dt>Caronas concluídas na demo</dt>
                      <dd>
                        {
                          data.requests.filter((q) => q.status === "completed")
                            .length
                        }
                      </dd>
                    </div>
                  </dl>
                  <a className="ua-secondary ua-exit" href="/entrar">
                    Sair da demonstração
                  </a>
                </section>
                <section className="ua-profile-info">
                  <NavigationArrow size={32} />
                  <h2>Confiança construída no caminho.</h2>
                  <p>
                    O selo de rota compartilhada aparece após três caronas
                    concluídas com a mesma pessoa. Não usamos estrelas.
                  </p>
                  {data.rides
                    .filter(
                      (r) =>
                        data.requests.filter(
                          (q) => q.rideId === r.id && q.status === "completed",
                        ).length >= 3,
                    )
                    .map((r) => (
                      <span className="ua-status accepted" key={r.id}>
                        Rota compartilhada com {r.driver}
                      </span>
                    ))}
                  <div className="ua-profile-note">
                    <strong>Calouros também têm lugar.</strong>
                    <p>
                      Na proposta, o selo de novo integrante acompanha os
                      primeiros 30 dias. Aqui, todos os perfis e vínculos são
                      fictícios.
                    </p>
                  </div>
                  <p className="ua-small">
                    A demonstração salva caronas e mensagens localmente. Não use
                    dados pessoais reais.
                  </p>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
      <Dialog.Root
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="ua-overlay" />
          <Dialog.Content className="ua-dialog">
            <Dialog.Close className="ua-close" aria-label="Fechar detalhes">
              <X size={22} />
            </Dialog.Close>
            <Dialog.Title>Conheça seu próximo caminho.</Dialog.Title>
            <Dialog.Description>
              Perfil e carona ilustrativos, sem reserva real.
            </Dialog.Description>
            {ride && (
              <>
                <div className="ua-detail-person">
                  <span className="ua-avatar large">
                    {ride.driver.slice(0, 1)}
                  </span>
                  <div>
                    <h3>{ride.driver}</h3>
                    <p>{ride.course}</p>
                    <span className="ua-status accepted">
                      <SealCheck size={16} />
                      Vínculo demonstrativo
                    </span>
                  </div>
                </div>
                <div className="ua-detail-route">
                  <span>
                    <MapPin />
                    {ride.origin}
                  </span>
                  <ArrowRight />
                  <span>Campus UniFio</span>
                </div>
                <div className="ua-detail-facts">
                  <span>
                    <Clock />
                    {ride.time}
                  </span>
                  <span>
                    <UsersThree />
                    {ride.seats} {ride.seats === 1 ? "vaga" : "vagas"}
                  </span>
                  <strong>{money(ride.price)} / pessoa</strong>
                </div>
                <p>
                  Contribuição direta ao motorista, por Pix ou dinheiro. O ponto
                  exato é combinado após o aceite.
                </p>
                <div className="ua-profile-note">
                  <strong>Conheça o vínculo, não uma nota.</strong>
                  <p>
                    {ride.own
                      ? "Esta carona foi publicada por você nesta demonstração."
                      : "Perfil fictício da mesma comunidade. Nenhuma avaliação por estrelas ou garantia de segurança."}
                  </p>
                </div>
                <button
                  className="ua-primary"
                  disabled={!!pending || ride.own || ride.seats < 1}
                  onClick={() => request(ride)}
                >
                  {ride.own
                    ? "Sua carona"
                    : pending
                      ? "Você já solicitou essa vaga"
                      : ride.seats < 1
                        ? "Sem vagas"
                        : "Solicitar vaga na demo"}
                </button>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={publish} onOpenChange={setPublish}>
        <Dialog.Portal>
          <Dialog.Overlay className="ua-overlay" />
          <Dialog.Content className="ua-dialog">
            <Dialog.Close className="ua-close" aria-label="Fechar publicação">
              <X size={22} />
            </Dialog.Close>
            <Dialog.Title>Seu caminho cabe mais gente.</Dialog.Title>
            <Dialog.Description>
              Publique uma carona de exemplo. Destino: campus UniFio.
            </Dialog.Description>
            <form
              className="ua-publish-form"
              onSubmit={(e) => {
                e.preventDefault();
                const f = new FormData(e.currentTarget);
                const p = places[Number(f.get("origin"))];
                const r: Ride = {
                  id: crypto.randomUUID(),
                  driver: "Alex Lima",
                  course: "Sistemas de Informação · 1º período",
                  origin: p.name,
                  lat: p.lat,
                  lng: p.lng,
                  date: String(f.get("date")),
                  time: String(f.get("time")),
                  price: Number(f.get("price")),
                  seats: Number(f.get("seats")),
                  recurring: f.get("recurring") === "on",
                  own: true,
                };
                setData({ ...data, rides: [r, ...data.rides] });
                setDate(r.date);
                setOrigin("");
                setTime("");
                setSelected(r.id);
                setPublish(false);
                setTab("explore");
                setNotice(
                  "Carona publicada neste navegador. Não está disponível para pessoas reais.",
                );
              }}
            >
              <div className="ua-form-row">
                <label>
                  Data
                  <input
                    type="date"
                    name="date"
                    required
                    min={today()}
                    defaultValue={today()}
                  />
                </label>
                <label>
                  Saída
                  <input
                    type="time"
                    name="time"
                    required
                    defaultValue="18:30"
                  />
                </label>
              </div>
              <PriceReference />
              <label className="ua-checkbox">
                <input name="recurring" type="checkbox" />
                Repetir nos dias úteis
              </label>
              <p className="ua-small">
                Combine a contribuição diretamente. Não há carteira ou pagamento
                dentro do app.
              </p>
              <button className="ua-primary" type="submit">
                Publicar carona de exemplo
                <ArrowRight size={18} />
              </button>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
function BuildingsIcon() {
  return <MapTrifold size={22} />;
}
function PageTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="ua-page-title">
      <div>
        <span className="ua-eyebrow">UM CAMINHO EM COMUM</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </div>
  );
}
function Empty({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: () => void;
}) {
  return (
    <div className="ua-empty">
      <NavigationArrow size={35} />
      <h2>{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="ua-secondary" onClick={action}>
          Continuar
          <ArrowRight size={17} />
        </button>
      )}
    </div>
  );
}
