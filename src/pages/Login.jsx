import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { getUsuario } from "../services/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros] = useState({});
  const [carregando, setCarregando] = useState(false);
  const [erroLogin, setErroLogin] = useState("");

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
    setErroLogin("");
    setCarregando(true);

    getUsuario()
      .then((usuario) => {
        if (usuario.email.toLowerCase() !== email.trim().toLowerCase()) {
          setErroLogin("E-mail não encontrado. Use o e-mail cadastrado.");
          return;
        }

        navigate("/dashboard");
      })
      .catch(() => {
        setErroLogin("Não foi possível conectar ao servidor. Tente novamente.");
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div className="login">
      {/* LOGO FORA DO CARD */}
      <div className="login__logo">
        <span className="login__logo-money">Money</span>
        <span className="login__logo-map">Map</span>
      </div>

      <div className="login__card">
        <h1 className="login__titulo">Entrar na minha conta</h1>

        <div className="login__campos">
          <div className="login__campo">
            <div className={`login__input-wrap ${erros.email ? "erro" : ""}`}>
              <input
                className="login__input"
                type="email"
                placeholder="E-mail"
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
            <div className={`login__input-wrap ${erros.senha ? "erro" : ""}`}>
              <input
                className="login__input"
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);

                  if (erros.senha) {
                    setErros((p) => ({ ...p, senha: "" }));
                  }
                }}
                onKeyDown={handleKeyDown}
              />

              <button
                type="button"
                className="login__toggle-senha"
                onClick={() => setMostrarSenha((p) => !p)}
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {erros.senha && <span className="login__erro">{erros.senha}</span>}
          </div>

          {/* AGORA É BUTTON */}
          <button className="login__esqueci" type="button">
            Esqueci minha senha
          </button>
        </div>

        <button
          className={`login__btn ${carregando ? "login__btn--carregando" : ""}`}
          onClick={handleLogin}
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "ENTRAR"}
        </button>

        <div className="login__separador">
          <span>Ou entre com:</span>
        </div>

        <button className="login__btn-google">
          <img
            src="https://www.google.com/favicon.ico"
            width={16}
            height={16}
            alt="Google"
          />
          Google
        </button>

        {erroLogin && <span className="login__erro">{erroLogin}</span>}

        <p className="login__rodape">
          Não tem uma conta?
          <span className="login__link"> Cadastre-se agora</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
