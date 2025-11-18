import mongoose from "mongoose";
const Usuario = mongoose.model("Usuario");

const formularioCrearCuenta = (req, res) => {
  res.render("crear-cuenta", {
    pagina: "Crea tu cuenta en DevJobs",
    tagline:
      "Comienza a publicar tu vacantes gratis, solo debes crear una cuenta",
  });
};

const validarRegistro = (req, res, next) => {
  // Sanitizar los datos
  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("email").escape();
  req.sanitizeBody("password").escape();
  req.sanitizeBody("confirmar").escape();

  //   Validar
  req.checkBody("nombre", "El nombre es obligatorio").notEmpty();
  req.checkBody("email", "El correo no es válido").isEmail();
  req.checkBody("password", "La contraseña no puede ir vacía").notEmpty();
  req
    .checkBody("confirmar", "Repetir la contraseña no puede ir vacía")
    .notEmpty();
  req
    .checkBody("confirmar", "Las contraseñas no son iguales")
    .equals(req.body.password);

  const errores = req.validationErrors();

  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );
    res.render("crear-cuenta", {
      pagina: "Crea tu cuenta en DevJobs",
      tagline:
        "Comienza a publicar tu vacantes gratis, solo debes crear una cuenta",
      mensajes: req.flash(),
    });
    return;
  }

  next();
};

const crearCuenta = async (req, res, next) => {
  const usuario = new Usuario(req.body);

  try {
    await usuario.save();
    res.redirect("/iniciar-sesion");
  } catch (error) {
    req.flash("error", error);
    res.redirect("/crear-cuenta");
  }
};

export { formularioCrearCuenta, validarRegistro, crearCuenta };
