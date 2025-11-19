import passport from "passport";
import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante");

const autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/administracion",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ambos campos son obligatorios",
});

const verificarUsuario = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/iniciar-sesion");
};

const mostrarPanel = async (req, res) => {
  // Consultar usuario autenticado
  const vacantes = await Vacante.find({
    autor: req.user._id,
  }).lean();

  res.render("administracion", {
    pagina: "Panel de administración",
    tagline: "Crea y administra tus vacantes desde aquí",
    vacantes,
  });
};

export { autenticarUsuario, mostrarPanel, verificarUsuario };
