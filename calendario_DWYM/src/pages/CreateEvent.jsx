import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function CreateEvent() {
  // Si la ruta trae un id, sabemos que estamos editando un evento existente.
  const { id } = useParams();
  // navigate nos sirve para volver al listado después de guardar.
  const navigate = useNavigate();

  // Estos estados guardan los datos del formulario del evento.
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Cuando estamos editando, pedimos los datos del evento para rellenar el formulario.
  useEffect(() => {
    if (!id) {
      return;
    }

    fetch(`http://localhost:3001/events/${id}`)
      .then((res) => res.json())
      .then((event) => {
        setTitle(event.title ?? "");
        setDescripcion(event.descripcion ?? "");
        setDate(event.date ?? "");
        setHoraInicio(event.horaInicio ?? "");
        setHoraFin(event.horaFin ?? "");
      });
  }, [id]);

  // Esta función crea un evento nuevo en el backend local.
  function crearEvento(nuevoEvento) {
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

  // Esta función actualiza un evento existente cuando estamos en modo edición.
  function editarEvento(nuevoEvento) {
    fetch(`http://localhost:3001/events/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(nuevoEvento),
    }).then(() => {
      window.alert("el evento ha sido actualizado correctamente ");
      navigate("/");
    });
  }

  // Evitamos que el formulario recargue la página y armamos el objeto del evento.
  function handleSubmit(e) {
    e.preventDefault();

    const nuevoEvento = {
      title,
      descripcion,
      date,
      horaInicio,
      horaFin,
    };

    // Si hay id, actualizamos; si no, creamos un evento nuevo.
    if (id) {
      editarEvento(nuevoEvento);
    } else {
      crearEvento(nuevoEvento);
      navigate("/");
    }

    setTitle("");
    setDescripcion("");
    setDate("");
    setHoraInicio("");
    setHoraFin("");
  }

  return (
    <div>
      {/* El título cambia según estemos creando o editando. */}
      <h1>{id ? "Editar Evento" : "Crear Evento"}</h1>
      <form onSubmit={handleSubmit}>
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

        {/* Usamos un botón submit para enviar el formulario. */}
        <button type="submit">{id ? "Guardar cambios" : "Crear evento"}</button>
      </form>

      {/* Este botón vuelve al listado principal. */}
      <Link to="/">
        <button>Volver</button>
      </Link>
    </div>
  );
}

export default CreateEvent;
