import "./CardCategoria.css";
// Se quiser usar a mesma imagem para todos por enquanto:
import imgPadrao from "../assets/categoria.png";

function CardCategoria({ categoria, percentual, iconePadrao }) {
  // Se você tiver imagens específicas para cada categoria, importe-as e mude aqui
  // Por enquanto, usaremos a imagem que vem da Home ou o import fixo
  const srcIcone = iconePadrao || imgPadrao;

  return (
    <div className="card-categoria">
      <div className="card-categoria__icone">
        <img
          src={srcIcone}
          alt={categoria}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <div className="card-categoria__info">
        <span className="card-categoria__label">Maior Categoria</span>
        <span className="card-categoria__nome">{categoria}</span>
        <span className="card-categoria__sub">{percentual}% do total</span>
      </div>
    </div>
  );
}

export default CardCategoria;
