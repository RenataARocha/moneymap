import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);

  function validar() {
    const novosErros = {};

    if (!email.trim()) {
      novosErros.email = "O e-mail é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = "Digite um e-mail válido.";
    }

    if (!senha.trim()) {
      novosErros.senha = "A senha é obrigatória.";
    } else if (senha.length < 6) {
      novosErros.senha = "A senha precisa ter no mínimo 6 caracteres.";
    }

    return novosErros;
  }

  function handleLogin() {
    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setCarregando(true);

    setTimeout(() => {
      setCarregando(false);
      navigate("/dashboard");
    }, 1200);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__logo">
          <span className="login__logo-money">Money</span>
          <span className="login__logo-map">Map</span>
        </div>

        <div className="login__header">
          <h1 className="login__titulo">Bem-vindo de volta!</h1>
          <p className="login__subtitulo">Entre na sua conta para continuar</p>
        </div>

        <div className="login__campos">
          <div className="login__campo">
            <label className="login__label">E-mail</label>
            <div className={`login__input-wrap ${erros.email ? "erro" : ""}`}>
              <Mail size={16} className="login__input-icone" />
              <input
                className="login__input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (erros.email) setErros((p) => ({ ...p, email: "" }));
                }}
                onKeyDown={handleKeyDown}
              />
            </div>
            {erros.email && <span className="login__erro">{erros.email}</span>}
          </div>

          <div className="login__campo">
            <label className="login__label">Senha</label>
            <div className={`login__input-wrap ${erros.senha ? "erro" : ""}`}>
              <Lock size={16} className="login__input-icone" />
              <input
                className="login__input"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  if (erros.senha) setErros((p) => ({ ...p, senha: "" }));
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="login__toggle-senha"
                onClick={() => setMostrarSenha((p) => !p)}
                tabIndex={-1}
              >
                {mostrarSenha ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {erros.senha && <span className="login__erro">{erros.senha}</span>}
          </div>
        </div>

        <button
          className={`login__btn ${carregando ? "login__btn--carregando" : ""}`}
          onClick={handleLogin}
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>

        <p className="login__rodape">
          Não tem uma conta? <span className="login__link">Cadastre-se</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
