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

const mostrarVacante = async (req, res, next) => {
  const { url } = req.params;
  const vacante = await Vacante.findOne({
    url,
  }).lean();

  if (!vacante) return next();

  res.render("vacante", {
    pagina: vacante.titulo,
    vacante,
    barra: true,
  });
};

const formularioEditarVacante = async (req, res, next) => {
  const vacante = await Vacante.findOne({
    url: req.params.url,
  }).lean();

  if (!vacante) return next();

  res.render("editar-vacante", {
    pagina: `Editar - ${vacante.titulo}`,
    vacante,
  });
};

const editarVacante = async (req, res) => {
  const vacanteActualizada = req.body;
  vacanteActualizada.skills = req.body.skills.split(",");
  const vacante = await Vacante.findOneAndUpdate(
    {
      url: req.params.url,
    },
    vacanteActualizada,
    {
      new: true,
      runValidators: true,
    }
  );
  res.redirect(`/vacantes/${vacante.url}`);
};

export {
  formularioNuevaVacante,
  agregarVacante,
  mostrarVacante,
  formularioEditarVacante,
  editarVacante,
};
