import { useState } from "react";

const sedes = {
  "Catamarca": generarRangos([[201, 210], [301, 310], [401, 410], [501, 510], [601, 610]]),
  "Venezuela": generarRangos([[1, 4], [101, 110], [201, 210], [301, 310], [401, 406]]),
  "Mexico": ["210", "310"],
  "Amenábar": generarRangos([[101, 103], [201, 206], [301, 306], [401, 406]]),
  "Remeo": generarRangos([[101, 115], [200, 207], [300, 307], [400, 411]]),
  "Ulme": generarRangos([[101, 114], [201, 214], [301, 310], [401, 406]]),
  "Basilea": generarRangos([[11, 18], [21, 28], [31, 38], [41, 48]]),
  "Azurduy": generarRangos([[101, 120], [201, 221], [301, 321]]),
  "Centro del Parque": generarRangos([[1, 23]]),
};

function generarRangos(rangos) {
  return rangos.flatMap(([start, end]) => {
    const width = Math.max(start, end).toString().length;
    return Array.from({ length: end - start + 1 }, (_, i) =>
      (start + i).toString().padStart(width, "0")
    );
  });
}

export default function App() {
  const [codigo, setCodigo] = useState("");
  const [sede, setSede] = useState("");
  const [habitacion, setHabitacion] = useState("");
  const [paciente, setPaciente] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [registros, setRegistros] = useState([]);

  const handleEnviar = async () => {
    if (!codigo || !sede || !habitacion || !paciente) {
      alert("Por favor, completá todos los campos.");
      return;
    }

    const nuevoRegistro = {
      codigo,
      sede,
      habitacion,
      paciente,
      fecha: new Date().toLocaleString(),
    };
    setRegistros([...registros, nuevoRegistro]);

    try {
      await fetch("https://api.sheetbest.com/sheets/08b15f41-9b7d-4211-aa0f-a4bd40c3951d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoRegistro),
      });

      await fetch("https://formsubmit.co/ajax/ingenieria.clinica@csantacatalina.com.ar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          Codigo: codigo,
          Sede: sede,
          Habitacion: habitacion,
          Paciente: paciente,
        }),
      });
    } catch (error) {
      console.error("Error al enviar datos:", error);
    }

    setEnviado(true);
    setTimeout(() => setEnviado(false), 3000);
    setCodigo("");
    setSede("");
    setHabitacion("");
    setPaciente("");
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center justify-start p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Registro de Ubicación</h1>

        <input
          type="text"
          placeholder="Código del equipo"
          className="w-full p-2 border border-orange-400 bg-orange-50 rounded"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        <select
          className="w-full p-2 border border-orange-400 bg-orange-100 rounded"
          value={sede}
          onChange={(e) => {
            setSede(e.target.value);
            setHabitacion("");
          }}
        >
          <option value="">Seleccionar sede</option>
          {Object.keys(sedes).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="w-full p-2 border border-orange-300 bg-gray-100 rounded"
          value={habitacion}
          onChange={(e) => setHabitacion(e.target.value)}
          disabled={!sede}
        >
          <option value="">Seleccionar habitación</option>
          {sede && sedes[sede].map((h) => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nombre del paciente"
          className="w-full p-2 border border-orange-400 bg-orange-50 rounded"
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
        />

        <button
          onClick={handleEnviar}
          className="w-full bg-orange-500 text-white font-semibold p-2 rounded hover:bg-orange-600"
        >
          Enviar
        </button>

        {enviado && <p className="text-green-600 text-center">Datos enviados correctamente.</p>}
      </div>

      {registros.length > 0 && (
        <div className="w-full max-w-2xl mt-10">
          <h2 className="text-xl font-bold mb-2 text-center">Registros enviados</h2>
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-orange-100">
                <th className="border p-1">Fecha</th>
                <th className="border p-1">Código</th>
                <th className="border p-1">Sede</th>
                <th className="border p-1">Habitación</th>
                <th className="border p-1">Paciente</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r, idx) => (
                <tr key={idx} className="odd:bg-gray-50">
                  <td className="border p-1">{r.fecha}</td>
                  <td className="border p-1">{r.codigo}</td>
                  <td className="border p-1">{r.sede}</td>
                  <td className="border p-1">{r.habitacion}</td>
                  <td className="border p-1">{r.paciente}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}