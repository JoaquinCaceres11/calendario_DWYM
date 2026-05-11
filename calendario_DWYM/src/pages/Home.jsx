import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Convertimos la fecha del input en un objeto Date para poder compararla fácilmente.
function convertirFechaLocal(fechaTexto) {
  const [anio, mes, dia] = fechaTexto.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

// Calculamos el inicio y el fin de la semana para filtrar eventos entre lunes y domingo.
function obtenerRangoSemana(fechaTexto) {
  const fecha = convertirFechaLocal(fechaTexto);
  const inicio = new Date(fecha);
  const desplazamiento = (inicio.getDay() + 6) % 7;

  inicio.setDate(inicio.getDate() - desplazamiento);

  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + 6);

  return { inicio, fin };
}

// Esta función decide qué eventos mostrar según la vista elegida: día, semana o mes.
function filtrarEventos(events, FechaSelected, vista) {
  if (FechaSelected === "") {
    return events;
  }

  if (vista === "dia") {
    return events.filter((evento) => evento.date === FechaSelected);
  }

  if (vista === "semana") {
    const { inicio, fin } = obtenerRangoSemana(FechaSelected);

    return events.filter((evento) => {
      const fechaEvento = convertirFechaLocal(evento.date);
      return fechaEvento >= inicio && fechaEvento <= fin;
    });
  }

  if (vista === "mes") {
    const fechaSeleccionada = convertirFechaLocal(FechaSelected);

    return events.filter((evento) => {
      const fechaEvento = convertirFechaLocal(evento.date);
      return (
        fechaEvento.getFullYear() === fechaSeleccionada.getFullYear() &&
        fechaEvento.getMonth() === fechaSeleccionada.getMonth()
      );
    });
  }

  return events;
}

function Home() {
  const [events, setEvents] = useState([]);

  // Guardamos la fecha elegida por el usuario y la vista activa del calendario.
  const [FechaSelected, setFechaSelected] = useState("2026-06-11");
  const [vista, setVista] = useState("dia");

  // Cargamos los eventos desde el backend local cuando se monta la pantalla.
  useEffect(() => {
    fetch("http://localhost:3001/events")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  }, []);

  // Borramos un evento solo después de confirmar con el usuario.
  function handleDelete(id) {
    const confirmar = window.confirm(
      "¿Seguro que deseas eliminar este evento?",
    );

    if (confirmar) {
      fetch(`http://localhost:3001/events/${id}`, {
        method: "DELETE",
      }).then(() => {
        setEvents((currentEvents) => currentEvents.filter((e) => e.id !== id));
      });
    }
  }

  // Aplicamos el filtro según la fecha elegida y la vista seleccionada.
  const eventosFiltrados = filtrarEventos(events, FechaSelected, vista);

  // Este texto ayuda a saber si estamos viendo el día, la semana o el mes.
  const tituloVista =
    vista === "dia" ? "día" : vista === "semana" ? "semana" : "mes";

  return (
    <div>
      <h1>Eventos</h1>

      <div className="header">
        <input
          type="date"
          value={FechaSelected}
          onChange={(e) => setFechaSelected(e.target.value)}
        />

        <div className="filtros">
          {/* Cada botón cambia la forma en que agrupamos los eventos. */}
          <button
            className={vista === "dia" ? "filtro activo" : "filtro"}
            onClick={() => setVista("dia")}
          >
            Día
          </button>

          <button
            className={vista === "semana" ? "filtro activo" : "filtro"}
            onClick={() => setVista("semana")}
          >
            Semana
          </button>

          <button
            className={vista === "mes" ? "filtro activo" : "filtro"}
            onClick={() => setVista("mes")}
          >
            Mes
          </button>
        </div>

        <button onClick={() => setFechaSelected("")}>Mostrar todos</button>

        <Link to="/create">
          <button>Crear evento</button>
        </Link>
      </div>

      <p className="vista-actual">Mostrando eventos por {tituloVista}.</p>

      {/* Si no hay resultados, mostramos un mensaje simple. */}
      {eventosFiltrados.length === 0 ? (
        <p className="sin-eventos">No hay eventos para esta selección.</p>
      ) : (
        <>
          {/* Si hay eventos, pintamos una tarjeta por cada uno. */}
          {eventosFiltrados.map((event) => (
            <div className="evento" key={event.id}>
              <div className="titulo">
                <p>{event.title}</p>
              </div>

              <div className="descripcion">
                <p>{event.descripcion}</p>
              </div>

              <div className="fecha">
                <p>{event.date}</p>
              </div>

              <div className="hora">
                <p>Inicio: {event.horaInicio}</p>
                <p>Fin: {event.horaFin}</p>
                {/* El botón editar lleva al formulario reutilizado con el id del evento. */}
                <Link to={`/edit/${event.id}`}>
                  <button className="editar">Editar</button>
                </Link>
                {/* El botón borrar elimina el evento después de la confirmación. */}
                <button className="borrar" onClick={() => handleDelete(event.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default Home;
