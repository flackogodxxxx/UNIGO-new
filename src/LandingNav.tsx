import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  List,
  X,
  Path,
  UsersThree,
  Buildings,
  SignIn,
  UserPlus,
} from "@phosphor-icons/react";

const links = [
  { id: "caminho", label: "Uma nova rota", icon: Path },
  { id: "confianca", label: "Nossa comunidade", icon: UsersThree },
  { id: "instituicao", label: "Para instituições", icon: Buildings },
];
export default function LandingNav() {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(""),
    [mobile, setMobile] = useState(
      () => window.matchMedia("(max-width: 900px)").matches,
    );
  const header = useRef<HTMLElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = matchMedia("(max-width: 900px)");
    const change = () => {
      setMobile(media.matches);
      setOpen(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  useEffect(() => {
    const sections = [
      "inicio",
      "caminho",
      "jornada",
      "confianca",
      "conexoes",
      "instituicao",
    ]
      .map((id) => document.getElementById(id))
      .filter((s): s is HTMLElement => !!s);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActive(
              id === "jornada"
                ? "caminho"
                : id === "conexoes"
                  ? "confianca"
                  : id,
            );
          }
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);
  return (
    <header ref={header} className="landing-nav">
      <a
        className="wordmark"
        href="#inicio"
        aria-label="UNIGO início"
        onClick={() => setOpen(false)}
      >
        unigo<span className="nav-brand-caption">Caminhos em comum</span>
      </a>
      <nav
        id="landing-navigation"
        aria-label="Principal"
        hidden={mobile && !open}
        className={open ? "open" : ""}
      >
        {links.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? "location" : undefined}
            onClick={() => setOpen(false)}
          >
            <Icon size={17} />
            <span>{label}</span>
          </a>
        ))}
        <a href="/cadastro" className="nav-mobile-register">
          <UserPlus size={17} />
          Criar conta
          <ArrowUpRight size={16} />
        </a>
        <span className="nav-mobile-note">
          Uma ideia para a comunidade UniFio.
        </span>
      </nav>
      <div className="nav-actions">
        <a className="login-link" href="/entrar">
          <SignIn size={18} />
          <span>Entrar</span>
        </a>
        <a className="nav-register" href="/cadastro">
          Criar conta
          <ArrowUpRight size={16} />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-controls="landing-navigation"
          aria-expanded={open}
          aria-label={open ? "Fechar navegação" : "Abrir navegação"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <List size={22} />}
        </button>
      </div>
    </header>
  );
}
