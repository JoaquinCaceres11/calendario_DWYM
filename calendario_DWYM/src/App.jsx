import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateEvent />} />
        {/* Reutilizamos el mismo formulario para editar un evento existente. */}
        <Route path="/edit/:id" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;