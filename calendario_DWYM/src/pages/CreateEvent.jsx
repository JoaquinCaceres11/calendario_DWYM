import { Link } from "react-router-dom";
import { useState } from "react";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [descripcion, setDescripcion] = useState("");

  function handleSubmit() {
    const nuevoEvento = {
      title,
      descripcion,
      date,
      horaInicio,
      horaFin,
    };
    fetch("http://localhost:3001/events", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(nuevoEvento),
    }).then(() => {
      window.alert("el evento ha sido creado correctamente ");
    });
  }

  return (
    <div>
      <h1>Crear Evento</h1>
      <div className="titDes">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <div className="horarios">
        <div>
          <label>Hora inicio</label>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
          />
        </div>

        <div>
          <label>Hora fin</label>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
          />
        </div>
      </div>

      

      <button onClick={handleSubmit}>Crear evento</button>

      <Link to="/">
        <button>Volver</button>
      </Link>
    </div>
  );
}

export default CreateEvent;
