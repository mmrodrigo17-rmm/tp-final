import estilos from './Paginacion.module.css';

const Paginacion = ({ paginaActual, totalPaginas, cargarPagina, cargando }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div className={estilos.pagination}>
      <button
        className={estilos.btnPage}
        onClick={() => cargarPagina(paginaActual - 1)}
        disabled={paginaActual <= 1 || cargando}
      >
        Anterior
      </button>

      <span className={estilos.pageInfo}>
        Página {paginaActual} de {totalPaginas}
      </span>

      <button
        className={estilos.btnPage}
        onClick={() => cargarPagina(paginaActual + 1)}
        disabled={paginaActual >= totalPaginas || cargando}
      >
        Siguiente
      </button>
    </div>
  );
};

export default Paginacion;
