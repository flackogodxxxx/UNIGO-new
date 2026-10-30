import { lazy, Suspense } from "react";
const App = lazy(() => import("./App"));
const Workspace = lazy(() => import("./app/Workspace"));
const AuthPage = lazy(() => import("./AuthPage"));
export default function Root() {
  const path = window.location.pathname.replace(/\/$/, "");
  const mode =
    path === "/cadastro"
      ? "register"
      : path === "/recuperar"
        ? "recover"
        : "login";
  const auth = ["/entrar", "/cadastro", "/recuperar"].includes(path);
  return (
    <Suspense
      fallback={
        <div className="route-loading" role="status">
          Carregando UNIGO…
        </div>
      }
    >
      {path === "/app" ? (
        <Workspace />
      ) : auth ? (
        <AuthPage mode={mode} />
      ) : (
        <App />
      )}
    </Suspense>
  );
}
