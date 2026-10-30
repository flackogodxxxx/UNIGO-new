import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  User,
  EnvelopeSimple,
  SignIn,
  UserPlus,
  Eye,
  EyeSlash,
  Check,
  IdentificationCard,
  LockKey,
  NavigationArrow,
} from "@phosphor-icons/react";
import AuthJourney from "./AuthJourney";
import "./AuthPage.css";
import "./AuthJourney.css";
type Mode = "login" | "register" | "recover";
export default function AuthPage({ mode }: { mode: Mode }) {
  const [values, setValues] = useState({
    name: "",
    identifier: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState(false);
  const register = mode === "register",
    recover = mode === "recover";
  useEffect(() => {
    document.title =
      mode === "register"
        ? "Criar conta | UNIGO"
        : mode === "recover"
          ? "Recuperar acesso | UNIGO"
          : "Entrar | UNIGO";
  }, [mode]);
  const title = recover
    ? "Vamos recuperar seu acesso."
    : register
      ? "Seu próximo encontro começa aqui."
      : "Bom ter você por aqui.";
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (register && values.name.trim().length < 2)
      next.name = "Informe seu nome completo.";
    if (!recover && !values.identifier.trim())
      next.identifier = "Informe seu R.A. ou matrícula institucional.";
    if ((register || recover) && !/^\S+@\S+\.\S+$/.test(values.email.trim()))
      next.email = "Informe um e-mail válido.";
    if (!recover && !values.password) next.password = "Informe sua senha.";
    if (register && values.password.length < 8)
      next.password = "Use pelo menos 8 caracteres.";
    if (register && values.confirm !== values.password)
      next.confirm = "As senhas precisam ser iguais.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        document.getElementById(`auth-${Object.keys(next)[0]}`)?.focus(),
      );
      return;
    }
    setValues({
      name: "",
      identifier: "",
      email: "",
      password: "",
      confirm: "",
    });
    setSuccess(true);
  }
  function field(
    key: keyof typeof values,
    label: string,
    type = "text",
    hint?: string,
  ) {
    const Icon =
      key === "name"
        ? User
        : key === "email"
          ? EnvelopeSimple
          : key === "identifier"
            ? IdentificationCard
            : LockKey;
    return (
      <div className="auth-field">
        <label htmlFor={`auth-${key}`}>{label}</label>
        <div className="auth-input-wrap">
          <Icon className="auth-field-icon" size={18} aria-hidden="true" />
          <input
            id={`auth-${key}`}
            name={key}
            type={type === "password" && show ? "text" : type}
            value={values[key]}
            onChange={(e) => {
              setValues({ ...values, [key]: e.target.value });
              setErrors({ ...errors, [key]: "" });
            }}
            autoComplete={
              key === "password"
                ? register
                  ? "new-password"
                  : "current-password"
                : key === "confirm"
                  ? "new-password"
                  : key === "identifier"
                    ? "username"
                    : key === "name"
                      ? "name"
                      : "email"
            }
            aria-invalid={!!errors[key]}
            aria-describedby={
              errors[key] ? `${key}-error` : hint ? `${key}-hint` : undefined
            }
            required
          />
          {key === "password" && (
            <button
              type="button"
              className="password-toggle"
              aria-label={show ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={show}
              onClick={() => setShow(!show)}
            >
              {show ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {errors[key] ? (
          <p className="field-error" id={`${key}-error`}>
            {errors[key]}
          </p>
        ) : hint ? (
          <p className="field-hint" id={`${key}-hint`}>
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
  return (
    <main className="auth-page">
      <aside className="auth-story">
        <a className="auth-brand" href="/" aria-label="UNIGO início">
          unigo
        </a>
        <div className="auth-story-content">
          <span className="auth-overline">UM CAMINHO EM COMUM</span>
          <h1>
            O campus aproxima.
            <br />O caminho <em>também.</em>
          </h1>
          <p>
            Uma conversa antes da aula. Uma companhia no trajeto. Sua comunidade
            pode começar antes de você chegar.
          </p>
          <AuthJourney />
          <div className="auth-promise">
            <IdentificationCard size={24} />
            <div>
              <strong>Gente da mesma instituição.</strong>
              <span>Vínculos reais. Rotas compartilhadas.</span>
            </div>
          </div>
        </div>
        <span className="auth-story-footer">
          Conceito independente para a comunidade UniFio.
        </span>
      </aside>
      <section className="auth-panel">
        <a className="auth-back" href="/">
          <ArrowLeft size={17} />
          Voltar para a UNIGO
        </a>
        <div className="auth-form-shell">
          <span className="auth-demo-label">PROTÓTIPO · SOMENTE FRONTEND</span>
          {success ? (
            <div className="auth-success" role="status">
              <span className="success-icon">
                <Check size={32} />
              </span>
              <h2>
                {recover
                  ? "Fluxo de recuperação demonstrado."
                  : register
                    ? "Cadastro demonstrado."
                    : "Acesso demonstrado."}
              </h2>
              <p>
                {recover
                  ? "Nenhum e-mail foi enviado. A recuperação real depende da integração com o servidor."
                  : register
                    ? "Nenhuma conta foi criada. Os campos foram limpos e seus dados não foram armazenados."
                    : "Nenhuma sessão foi iniciada. Esta tela demonstra a experiência de entrada, sem validar credenciais reais."}
              </p>
              <a href="/app" className="auth-submit">
                Entrar no app de demonstração <ArrowRight size={18} />
              </a>
              <button
                className="auth-restart"
                onClick={() => {
                  setSuccess(false);
                  setShow(false);
                }}
              >
                Voltar ao formulário
              </button>
            </div>
          ) : (
            <>
              <h2>{title}</h2>
              <p className="auth-description">
                {recover
                  ? "Informe seu e-mail para visualizar o fluxo de recuperação."
                  : register
                    ? "Preencha seus dados para conhecer a experiência de cadastro na comunidade."
                    : "Entre com seu vínculo institucional para continuar seu caminho."}
              </p>
              {!recover && (
                <nav className="auth-tabs" aria-label="Acesso à plataforma">
                  <a
                    href="/entrar"
                    aria-current={!register ? "page" : undefined}
                  >
                    <SignIn size={17} aria-hidden="true" /> Entrar
                  </a>
                  <a
                    href="/cadastro"
                    aria-current={register ? "page" : undefined}
                  >
                    <UserPlus size={17} aria-hidden="true" /> Criar conta
                  </a>
                </nav>
              )}
              <form onSubmit={submit} noValidate>
                {register && field("name", "Nome completo")}
                {!recover &&
                  field(
                    "identifier",
                    "R.A. ou matrícula",
                    "text",
                    "A verificação institucional ainda não está conectada.",
                  )}
                {(register || recover) && field("email", "E-mail", "email")}
                {!recover &&
                  field(
                    "password",
                    "Senha",
                    "password",
                    register
                      ? "Pelo menos 8 caracteres. Use dados fictícios neste protótipo."
                      : undefined,
                  )}
                {register && field("confirm", "Confirmar senha", "password")}
                {!register && !recover && (
                  <a className="forgot-link" href="/recuperar">
                    Esqueci minha senha
                  </a>
                )}
                <button className="auth-submit" type="submit">
                  {recover
                    ? "Simular recuperação"
                    : register
                      ? "Simular cadastro"
                      : "Simular entrada"}
                  <ArrowRight size={18} />
                </button>
                <p className="auth-privacy">
                  <LockKey size={15} />
                  Não enviamos nem salvamos os dados deste formulário.
                </p>
              </form>
              {recover && (
                <a className="auth-back" href="/entrar">
                  <ArrowLeft size={16} />
                  Voltar para entrar
                </a>
              )}
            </>
          )}
          <div className="auth-help">
            <NavigationArrow size={17} />
            <span>
              Prefere conhecer primeiro?{" "}
              <a href="/#jornada">Explore a ideia.</a>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
