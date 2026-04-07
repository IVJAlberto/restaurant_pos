import { useEffect, useRef, useState } from "react";

const CocinaOrder = ({ pedido, getEstadoPlatillo, actualizarEstadoPlatillo }) => {
  const [abierto, setAbierto] = useState(true);
  const [alturaContenido, setAlturaContenido] = useState("auto");
  const contentRef = useRef(null);

  useEffect(() => {
    if (!contentRef.current) return;

    if (abierto) {
      setAlturaContenido(`${contentRef.current.scrollHeight}px`);
    } else {
      setAlturaContenido("0px");
    }
  }, [abierto, pedido.platillosCocina]);

  return (
    <div className="bg-gradient-to-r from-black/30 to-black/20 p-4 rounded-2xl border-2 border-black shadow-xl">
      <button
        type="button"
        onClick={() => setAbierto((prev) => !prev)}
        className="w-full flex items-start justify-between gap-4 mb-1 text-left"
      >
        <div className="flex flex-row gap-4 min-w-0 items-center">
            <h3 className="text-xl font-bold text-white mb-1">MESA {pedido.mesa} 
                <span className="text-sm font-normal text-zinc-300 ml-2">({Object.keys(pedido.platillosCocina).length} platillos)</span>
            </h3>
            {/* <p className="text-zinc-300 text-sm truncate h-full">#{pedido.timestamp}</p> */}
        </div>

        <span
          className={`inline-block transition-transform duration-300 ease-in-out text-white ${
            abierto ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </span>
      </button>

      <div
        style={{ height: alturaContenido }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div
          ref={contentRef}
          className={`transition-all duration-300 ease-in-out ${
            abierto ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          {Object.entries(pedido.platillosCocina).map(([idPlatillo, data]) => {
            const estadoActual = getEstadoPlatillo(`${pedido.mesa}-${idPlatillo}`);

            return (
              <div key={idPlatillo} className="mb-1 last:mb-0">
                <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-lg truncate">
                      {data.nombre}
                      <span className="text-zinc-300 ml-2">x{data.cantidad}</span>
                    </p>

                    {data.notas && (
                      <p className="text-yellow-300 text-base mt-1 bg-yellow-900/30 px-2 py-1 rounded inline-block">
                        📝 {data.notas}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-row space-x-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        actualizarEstadoPlatillo(
                          data.timestampCaptura,
                          idPlatillo,
                          "preparando",
                          pedido.mesa
                        )
                      }
                      className={`px-3 py-1.5 text-white text-base font-medium rounded shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap
                        ${
                          estadoActual === "preparando"
                            ? "bg-yellow-600 hover:bg-yellow-700 cursor-not-allowed pointer-events-none"
                            : estadoActual === "listo"
                            ? "bg-blue-600/20 hover:bg-blue-700/20 opacity-50 cursor-not-allowed pointer-events-none"
                            : "bg-gray-600 hover:bg-gray-700"
                        }
                      `}
                    >
                      Preparando
                    </button>

                    <button
                      onClick={() =>
                        actualizarEstadoPlatillo(
                          pedido.timestamp,
                          idPlatillo,
                          "listo",
                          pedido.mesa
                        )
                      }
                      className={`px-3 py-1.5 text-white text-base font-medium rounded shadow-md transition-all disabled:opacity-75 disabled:cursor-not-allowed whitespace-nowrap
                        ${
                          estadoActual === "listo"
                            ? "bg-purple-600 hover:bg-purple-700 cursor-not-allowed pointer-events-none"
                            : "bg-gray-600 hover:bg-gray-700"
                        }
                      `}
                    >
                      Listo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CocinaOrder;