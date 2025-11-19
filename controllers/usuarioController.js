import mongoose from "mongoose";
const Usuario = mongoose.model("Usuario");
import multer from "multer";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import shortid from "shortid";

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

const formularioIniciarSesion = async (req, res) => {
  res.render("iniciar-sesion", {
    pagina: "Inicia sesión en DevJobs",
  });
};

const formularioEditarPefil = (req, res) => {
  res.render("editar-perfil", {
    pagina: "Edita tu perfil en DevJobs",
    usuario: req.user.toObject(),
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
  });
};

const editarPerfil = async (req, res) => {
  const usuario = await Usuario.findById(req.user._id);

  usuario.nombre = req.body.nombre;
  usuario.email = req.body.email;

  if (req.body.password) {
    usuario.password = req.body.password;
  }

  if (req.file) {
    usuario.imagen = req.file.filename;
  }

  await usuario.save();

  req.flash("correcto", "Cambios guardados correctamente");

  res.redirect("/administracion");
};

const validarPerfil = (req, res, next) => {
  req.sanitizeBody("nombre").escape();
  req.sanitizeBody("email").escape();
  if (req.body.password) {
    req.sanitizeBody("password").escape();
  }

  req.checkBody("nombre", "El nombre es obligatorio").notEmpty();
  req.checkBody("email", "El correo no es válido").isEmail();

  const errores = req.validationErrors();

  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    return res.render("editar-perfil", {
      pagina: "Edita tu perfil en DevJobs",
      usuario: req.user.toObject(),
      cerrarSesion: true,
      nombre: req.user.nombre,
      imagen: req.user.imagen,
      mensajes: req.flash(),
    });
  }
  next();
};

const subirImagen = async (req, res, next) => {
  upload(req, res, function (error) {
    if (error) {
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("error", "El archivo es muy grande, máximo 100kb");
        } else {
          req.flash("error", error.message);
        }
      } else {
        req.flash("error", error.message);
      }
      res.redirect("/administracion");
      return;
    } else {
      next();
    }
  });
};

const configuracionMulter = {
  limits: { fileSize: 100000 },
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + "../../public/uploads/perfiles");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Formato no válido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("imagen");

export {
  formularioCrearCuenta,
  validarRegistro,
  crearCuenta,
  formularioIniciarSesion,
  formularioEditarPefil,
  editarPerfil,
  validarPerfil,
  subirImagen,
};
