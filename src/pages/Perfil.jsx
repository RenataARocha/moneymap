import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const avatares = [
  { id: "neutro", emoji: "🧑" },
  { id: "feminino", emoji: "👩" },
  { id: "masculino", emoji: "👨" },
  { id: "robo", emoji: "🤖" },
  { id: "gato", emoji: "🐱" },
];

function Perfil() {
  const navigate = useNavigate();

  const [nome, setNome] = useState(() => localStorage.getItem("mm-nome") || "");
  const [sobrenome, setSobrenome] = useState(
    () => localStorage.getItem("mm-sobrenome") || "",
  );
  const [genero, setGenero] = useState(
    () => localStorage.getItem("mm-genero") || "Prefiro não dizer",
  );
  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("mm-avatar") || "neutro",
  );
  const [salvo, setSalvo] = useState(false);

  function handleSalvar() {
    localStorage.setItem("mm-nome", nome);
    localStorage.setItem("mm-sobrenome", sobrenome);
    localStorage.setItem("mm-genero", genero);
    localStorage.setItem("mm-avatar", avatar);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2500);
  }

  const avatarAtual = avatares.find((a) => a.id === avatar);

  return (
    <div className="perfil">
      <div className="perfil__topo">
        <div>
          <h2 className="perfil__titulo">Perfil</h2>
          <p className="perfil__subtitulo">Personalize sua experiência</p>
        </div>
        <button
          className="perfil__voltar"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft size={14} /> Início
        </button>
      </div>

      <div className="perfil__card">
        <div className="perfil__avatar-wrap">
          <div className="perfil__avatar-atual">{avatarAtual?.emoji}</div>
          <span className="perfil__avatar-label">Avatar atual: {avatar}</span>
          <div className="perfil__avatares">
            {avatares.map((a) => (
              <button
                key={a.id}
                className={`perfil__avatar-btn ${avatar === a.id ? "ativo" : ""}`}
                onClick={() => setAvatar(a.id)}
                title={a.id}
              >
                {a.emoji}
              </button>
            ))}
          </div>
        </div>

        <div className="perfil__campo">
          <label className="perfil__label">Seu nome *</label>
          <input
            className="perfil__input"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite seu nome"
          />
        </div>

        <div className="perfil__campo">
          <label className="perfil__label">Sobrenome *</label>
          <input
            className="perfil__input"
            type="text"
            value={sobrenome}
            onChange={(e) => setSobrenome(e.target.value)}
            placeholder="Digite seu sobrenome"
          />
        </div>

        <div className="perfil__campo">
          <label className="perfil__label">Gênero *</label>
          <select
            className="perfil__select"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option>Prefiro não dizer</option>
            <option>Feminino</option>
            <option>Masculino</option>
            <option>Não-binário</option>
            <option>Outro</option>
          </select>
        </div>

        <button className="perfil__salvar" onClick={handleSalvar}>
          {salvo ? "✅ Salvo!" : "Salvar alterações"}
        </button>

        <button className="perfil__sair" onClick={() => navigate("/login")}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}

export default Perfil;
