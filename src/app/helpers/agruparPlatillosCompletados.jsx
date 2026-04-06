
export const agruparPlatillosCompletados = (platillos) => {
  const mapa = platillos.reduce((acc, platillo) => {

    const key = `${platillo.nombre}::${platillo.notas || ''}`;

    if (!acc[key]) {
      acc[key] = {
        ...platillo,
        cantidad: 0,
        subtotal: 0,
        _platillosOriginales: [],
      };
    }

    const cantidad = Number(platillo.cantidad ?? 1) || 0;
    const precio = Number(platillo.precio ?? platillo.precioUnitario ?? 0) || 0;

    acc[key].cantidad += cantidad;
    acc[key].subtotal += precio * cantidad;
    acc[key]._platillosOriginales.push(platillo);
    return acc;
  }, {});

  return Object.values(mapa).sort((a, b) =>
    a.nombre.localeCompare(b.nombre, undefined, { sensitivity: 'base' })
  );
};
