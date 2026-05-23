import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";
import { motion } from "framer-motion";

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
      <motion.div
        className="perfil__topo"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <div>
          <h2 className="perfil__titulo">Perfil</h2>
          <p className="perfil__subtitulo">Personalize sua experiência</p>
        </div>
      </motion.div>

      <motion.div
        className="perfil__card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
      >
        <div className="perfil__avatar-wrap">
          <div
            className="perfil__avatar-atual"
            aria-label={`Avatar atual ${avatar}`}
          >
            {avatarAtual?.emoji}
          </div>
          <span className="perfil__avatar-label">Avatar atual: {avatar}</span>
          <div className="perfil__avatares">
            {avatares.map((a, index) => (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                }}
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                key={a.id}
                className={`perfil__avatar-btn ${avatar === a.id ? "ativo" : ""}`}
                onClick={() => setAvatar(a.id)}
                aria-label={`Selecionar avatar ${a.id}`}
                aria-pressed={avatar === a.id}
              >
                {a.emoji}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          className="perfil__campos"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.2,
          }}
        >
          <div className="perfil__campo">
            <label htmlFor="nome" className="perfil__label">
              Seu nome *
            </label>

            <input
              id="nome"
              className="perfil__input"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
            />
          </div>

          <div className="perfil__campo">
            <label htmlFor="sobrenome" className="perfil__label">
              Sobrenome *
            </label>
            <input
              id="sobrenome"
              className="perfil__input"
              type="text"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
              placeholder="Digite seu sobrenome"
            />
          </div>

          <div className="perfil__campo perfil__campo--full">
            <label htmlFor="sobrenome" className="perfil__label">
              Gênero *
            </label>
            <select
              id="genero"
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
        </motion.div>

        <motion.div
          className="perfil__acoes"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.3,
          }}
        >
          <motion.button
            type="button"
            className="perfil__salvar"
            onClick={handleSalvar}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
          >
            Salvar alterações
          </motion.button>

          <button
            type="button"
            className="perfil__sair"
            aria-label="Sair da conta"
            onClick={() => navigate("/login")}
          >
            Sair da conta
          </button>

          {salvo && (
            <p className="perfil__feedback" role="status" aria-live="polite">
              ✅ Perfil salvo com sucesso!
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Perfil;
