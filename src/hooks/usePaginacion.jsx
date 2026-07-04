import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../firebase/config";

/**
 * Hook de paginación cursor-based con Firestore.
 *
 * @param {string} nombreColeccion - Nombre de la colección en Firestore
 * @param {string} campoOrden - Campo por el cual ordenar (default: "title")
 * @param {number} itemsPorPagina - Items por página (default: 8)
 * @returns {{ data, cargando, paginaActual, totalPaginas, cargarPagina, refrescarPagina }}
 */
export const usePaginacion = (
  nombreColeccion = "productos",
  campoOrden = "title",
  itemsPorPagina = 8
) => {
  const [data, setData] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [historialDocs, setHistorialDocs] = useState([null]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(false);

  // Obtiene el total de documentos para calcular la cantidad de páginas
  const obtenerTotal = async () => {
    try {
      const snapshot = await getCountFromServer(collection(db, nombreColeccion));
      setTotalPaginas(Math.ceil(snapshot.data().count / itemsPorPagina));
    } catch (error) {
      console.error("Error al obtener total:", error);
    }
  };

  // Carga una página específica usando cursores (startAfter)
  const cargarPagina = async (numeroPagina) => {
    setCargando(true);

    try {
      let consulta;

      if (numeroPagina === 1) {
        consulta = query(
          collection(db, nombreColeccion),
          orderBy(campoOrden),
          limit(itemsPorPagina)
        );
      } else {
        const documentoAnterior = historialDocs[numeroPagina - 1];
        if (!documentoAnterior) {
          setCargando(false);
          return;
        }

        consulta = query(
          collection(db, nombreColeccion),
          orderBy(campoOrden),
          startAfter(documentoAnterior),
          limit(itemsPorPagina)
        );
      }

      const snapshot = await getDocs(consulta);

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(items);
      setPaginaActual(numeroPagina);

      // Guarda el último documento como referencia para la siguiente página
      if (!historialDocs[numeroPagina] && snapshot.docs.length > 0) {
        const ultimoDocumento = snapshot.docs[snapshot.docs.length - 1];
        const nuevoHistorial = [...historialDocs];
        nuevoHistorial[numeroPagina] = ultimoDocumento;
        setHistorialDocs(nuevoHistorial);
      }
    } catch (error) {
      console.error("Error al cargar página:", error);
    } finally {
      setCargando(false);
    }
  };

  // Al montar o cambiar de colección, resetea el historial y carga la primera página
  useEffect(() => {
    setHistorialDocs([null]);
    setPaginaActual(1);
    setData([]);
    obtenerTotal();
    cargarPagina(1);
  }, [nombreColeccion, campoOrden]);

  // Recarga la página actual (útil después de crear/editar/eliminar)
  const refrescarPagina = () => {
    obtenerTotal();
    cargarPagina(paginaActual);
  };

  return {
    data,
    cargando,
    paginaActual,
    totalPaginas,
    cargarPagina,
    refrescarPagina,
  };
};
