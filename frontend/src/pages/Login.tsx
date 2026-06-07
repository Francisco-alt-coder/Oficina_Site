import { ArrowLeft, Eye, EyeOff, Lock, Mail, Wrench } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTH_KEY = "oficina-auth";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const openPasswordRecovery = () => {
    setError("");
    setSuccessMessage("");
    setRecoveryEmail(email.trim());
    setIsRecoveringPassword(true);
  };

  const closePasswordRecovery = () => {
    setError("");
    setSuccessMessage("");
    setIsRecoveringPassword(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim() || !password.trim()) {
      setError("Informe e-mail e senha para entrar.");
      return;
    }

    if (password.trim().length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        email: email.trim(),
        loggedAt: new Date().toISOString(),
      })
    );

    navigate("/dashboard", { replace: true });
  };

  const handlePasswordRecovery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    const normalizedEmail = recoveryEmail.trim();

    if (!normalizedEmail) {
      setError("Informe seu e-mail para recuperar a senha.");
      return;
    }

    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setError("Informe um e-mail válido para recuperar a senha.");
      return;
    }

    setSuccessMessage(
      "Enviamos as instruções de recuperação para o e-mail informado."
    );
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-label="Entrar no Oficina Pro">
        <div className="login-brand">
          <span>
            <Wrench size={26} />
          </span>
          <div>
            <strong>Oficina Pro</strong>
            <p>Gestão inteligente para oficinas</p>
          </div>
        </div>

        {isRecoveringPassword ? (
          <button
            type="button"
            className="login-back-button"
            onClick={closePasswordRecovery}
          >
            <ArrowLeft size={18} />
            Voltar para o login
          </button>
        ) : null}

        <div className="login-heading">
          <h1>{isRecoveringPassword ? "Recuperar senha" : "Entrar no sistema"}</h1>
          <p>
            {isRecoveringPassword
              ? "Informe seu e-mail para receber as instruções de recuperação."
              : "Acesse o painel para gerenciar clientes, veículos e ordens de serviço."}
          </p>
        </div>

        {error && <div className="login-error">{error}</div>}
        {successMessage && <div className="login-success">{successMessage}</div>}

        {isRecoveringPassword ? (
          <form className="login-form" onSubmit={handlePasswordRecovery}>
            <label>
              <span>E-mail</span>
              <div className="login-field">
                <Mail size={20} />
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                  placeholder="admin@oficina.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <button type="submit" className="login-submit">
              Enviar instruções
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <span>E-mail</span>
              <div className="login-field">
                <Mail size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@oficina.com"
                  autoComplete="email"
                />
              </div>
            </label>

            <label>
              <span>Senha</span>
              <div className="login-field">
                <Lock size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="mínimo 6 caracteres"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </label>

            <button
              type="button"
              className="login-forgot-button"
              onClick={openPasswordRecovery}
            >
              Esqueceu sua senha?
            </button>

            <button type="submit" className="login-submit">
              Entrar
            </button>
          </form>
        )}

        <p className="login-demo-note">
          {isRecoveringPassword
            ? "Para demonstração, a confirmação aparece na tela após informar um e-mail válido."
            : "Para demonstração, use qualquer e-mail válido e uma senha com 6 ou mais caracteres."}
        </p>
      </section>
    </main>
  );
}
