import passport from "passport";
import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante");
const Usuario = mongoose.model("Usuario");
import crypto from "crypto";
import { enviar } from "../handlers/email.js";

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
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
  });
};

const cerrarSesion = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("correcto", "Sesión cerrada correctamente");
    return res.redirect("/iniciar-sesion");
  });
};

const formularioOlvide = (req, res) => {
  res.render("olvide", {
    pagina: "Reestablece tu contraseña en DevJobs",
    tagline:
      "Si ya tienes una cuenta pero olvidaste tu contraseña, coloca tu correo",
  });
};

const enviarToken = async (req, res) => {
  const usuario = await Usuario.findOne({
    email: req.body.email,
  });
  if (!usuario) {
    req.flash("error", "El usuario no existe");
    return res.redirect(req.originalUrl);
  }

  usuario.token = crypto.randomBytes(20).toString("hex");
  usuario.expira = Date.now() + 3600000;
  await usuario.save();

  const resetUrl = `http://${req.headers.host}/olvide/${usuario.token}`;
  console.log(resetUrl);

  await enviar({
    usuario,
    resetUrl,
  });

  req.flash("correcto", "Revisa tu correo y sigue las instrucciones");
  res.redirect("/iniciar-sesion");
};

const formularioReestablecer = async (req, res) => {
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: {
      $gt: Date.now(),
    },
  });

  if (!usuario) {
    req.flash("error", "El token no es válido");
    return res.redirect("/olvide");
  }

  res.render("reestablecer", {
    pagina: "Nueva contraseña en DevJobs",
  });
};

const reestablecer = async (req, res) => {
  const usuario = await Usuario.findOne({
    token: req.params.token,
    expira: {
      $gt: Date.now(),
    },
  });

  if (!usuario) {
    req.flash("error", "El token no es válido");
    return res.redirect("/olvide");
  }

  usuario.password = req.body.password;
  usuario.token = undefined;
  usuario.expira = undefined;
  await usuario.save();
  req.flash("correcto", "Contraseña modificada correctamente");
  res.redirect("/iniciar-sesion");
};

export {
  autenticarUsuario,
  mostrarPanel,
  verificarUsuario,
  cerrarSesion,
  formularioOlvide,
  enviarToken,
  formularioReestablecer,
  reestablecer,
};
