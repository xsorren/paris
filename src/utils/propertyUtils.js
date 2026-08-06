/**
 * Formatea un ID numérico de propiedad (number/double) al formato visual #001, #002, etc.
 * Solo para visualización en el frontend. En Firebase se almacena como número (double/int).
 *
 * @param {number|string} id - ID numérico de la propiedad (ej: 1, 2, 15)
 * @returns {string} ID formateado (ej: "#001", "#002", "#015")
 */
export const formatearIdPropiedad = (id) => {
  if (id === null || id === undefined || id === "" || isNaN(id)) return "";
  const num = Math.floor(Number(id));
  return `#${String(num).padStart(3, "0")}`;
};
