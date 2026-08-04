import { useEffect, useState } from "react";

function FormularioSocio({ agregarSocio, socioAEditar }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("Premium");

  useEffect(() => {
    if (socioAEditar) {
      setNombre(socioAEditar.nombre || "");
      setEmail(socioAEditar.email || "");
      setPlan(socioAEditar.plan || "Premium");
    } else {
      setNombre("");
      setEmail("");
      setPlan("Premium");
    }
  }, [socioAEditar]);

  const guardar = () => {
    if (!nombre.trim() || !email.trim()) {
      alert("Complete todos los campos");
      return;
    }

    if (!email.includes("@")) {
      alert("Ingrese un correo electrónico válido.");
      return;
    }

    agregarSocio({
      nombre,
      email,
      plan,
    });

    setNombre("");
    setEmail("");
    setPlan("Premium");
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4>{socioAEditar ? "Editar Socio" : "Nuevo Socio"}</h4>

        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          className="form-select mb-3"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        >
          <option value="Premium">Premium</option>
          <option value="Básico">Básico</option>
        </select>

        <button className="btn btn-primary" onClick={guardar}>
          {socioAEditar ? "Guardar cambios" : "Agregar Socio"}
        </button>
      </div>
    </div>
  );
}

export default FormularioSocio;
