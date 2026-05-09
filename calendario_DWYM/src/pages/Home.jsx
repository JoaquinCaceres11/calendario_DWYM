import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [events, setEvents] = useState([]);

  const [FechaSelected, setFechaSelected] = useState("2026-06-11");

  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  function handleDelete(id) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este evento?",
    );

    if (confirmar) {
      fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      }).then(() => {
        setEvents(events.filter((e) => e.id !== id));
      });
    }
  }
  const eventosDelDia =
    FechaSelected === ""
      ? events
      : events.filter((e) => e.date === FechaSelected);
  return (
    <div>
      <h1>Eventos</h1>

      <div className="header">
        <input
          type="date"
          value={FechaSelected}
          onChange={(e) => setFechaSelected(e.target.value)}
        />

        <button onClick={() => setFechaSelected("")}>Mostrar todos</button>

        <Link to="/create">
          <button>Crear evento</button>
        </Link>
      </div>

      {eventosDelDia.map((event) => (
        <div className="evento" key={event.id}>
          <div className="titulo">
            <p>{event.title}</p>
          </div>

          <div className="fecha">
            <p>{event.date}</p>
          </div>

          <div className="hora">
            <p>Inicio: {event.horaInicio}</p>
            <p>Fin: {event.horaFin}</p>
            <button className="borrar" onClick={() => handleDelete(event.id)}>
              🗑️
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
