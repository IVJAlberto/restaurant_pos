
export const agruparPlatillosCompletados = (platillos) => {
  const mapa = platillos.reduce((acc, platillo) => {

    const key = `${platillo.nombre}::${platillo.notas || ''}`;

    if (!acc[key]) {
      acc[key] = {
        ...platillo,
        cantidad: 0,
        _platillosOriginales: [],
      };
    }

    acc[key].cantidad += platillo.cantidad ?? 1;
    acc[key]._platillosOriginales.push(platillo);
    return acc;
  }, {});

  return Object.values(mapa).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, undefined, { sensitivity: 'base' })
  );
};
