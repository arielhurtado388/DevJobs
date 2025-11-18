import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante");

const mostrarTrabajos = async (req, res, next) => {
  const vacantes = await Vacante.find().lean();

  if (!vacantes) return next();

  res.render("home", {
    pagina: "DevJobs",
    tagline: "Encuentra y publica trabajos para desarrolladores web",
    barra: true,
    boton: true,
    vacantes,
  });
};

export { mostrarTrabajos };
