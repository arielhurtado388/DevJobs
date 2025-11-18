import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante");

const formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    pagina: "Nueva vacante",
    tagline: "Llena el formulario y publica tu vacante",
  });
};

const agregarVacante = async (req, res) => {
  const vacante = await Vacante.create(req.body);

  // Crear arreglo a parti de string
  vacante.skills = req.body.skills.split(",");

  // Almacenar en la DB
  const nuevaVacante = await vacante.save();

  // Redireccionar
  res.redirect(`/vacantes/${nuevaVacante.url}`);
};

export { formularioNuevaVacante, agregarVacante };
