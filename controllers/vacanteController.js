import mongoose from "mongoose";
const Vacante = mongoose.model("Vacante");
import multer from "multer";
import shortid from "shortid";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formularioNuevaVacante = (req, res) => {
  res.render("nueva-vacante", {
    pagina: "Nueva vacante",
    tagline: "Llena el formulario y publica tu vacante",
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
  });
};

const agregarVacante = async (req, res) => {
  const vacante = await Vacante(req.body);

  // Autor
  vacante.autor = req.user._id;

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
  })
    .populate("autor")
    .lean();

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
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
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

// Validar y sanitizar datos de vacantes
const validarVacante = (req, res, next) => {
  // Sanitizar
  req.sanitizeBody("titulo").escape();
  req.sanitizeBody("empresa").escape();
  req.sanitizeBody("ubicacion").escape();
  req.sanitizeBody("salario").escape();
  req.sanitizeBody("contrato").escape();
  req.sanitizeBody("skills").escape();

  // Validar
  req.checkBody("titulo", "El titulo es obligatorio").notEmpty();
  req.checkBody("empresa", "El nombre de la empresa es obligatoria").notEmpty();
  req.checkBody("ubicacion", "La ubicación es obligatoria").notEmpty();
  req.checkBody("contrato", "El tipo de contrato es obligatorio").notEmpty();
  req.checkBody("skills", "Agrega al menos una habilidad").notEmpty();

  const errores = req.validationErrors();

  if (errores) {
    req.flash(
      "error",
      errores.map((error) => error.msg)
    );

    return res.render("nueva-vacante", {
      pagina: "Nueva vacante",
      tagline: "Llena el formulario y publica tu vacante",
      cerrarSesion: true,
      nombre: req.user.nombre,
      imagen: req.user.imagen,
      mensajes: req.flash(),
    });
  }

  next();
};

const eliminarVacante = async (req, res) => {
  const { id } = req.params;
  const vacante = await Vacante.findById(id);

  if (veririfcarAutor(vacante, req.user)) {
    await vacante.deleteOne();
    res.status(200).send("Vacante eliminada correctamente");
  } else {
    res.status(403).send("Error");
  }
};

const veririfcarAutor = (vacante = {}, usuario = {}) => {
  if (!vacante.autor.equals(usuario._id)) {
    return false;
  }
  return true;
};

const subirCV = async (req, res, next) => {
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
      res.redirect(req.originalUrl);
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
      cb(null, __dirname + "../../public/uploads/cv");
    },
    filename: (req, file, cb) => {
      const extension = file.mimetype.split("/")[1];
      cb(null, `${shortid.generate()}.${extension}`);
    },
  }),
  fileFilter(req, file, cb) {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Formato no válido"), false);
    }
  },
};

const upload = multer(configuracionMulter).single("cv");

const contactar = async (req, res, next) => {
  const vacante = await Vacante.findOne({
    url: req.params.url,
  });

  if (!vacante) return next();

  const nuevoCandidato = {
    nombre: req.body.nombre,
    email: req.body.email,
    cv: req.file.filename,
  };

  vacante.candidatos.push(nuevoCandidato);
  await vacante.save();

  req.flash("correcto", "Se envió tu hoja de vida correctamente");
  res.redirect("/");
};

const mostrarCandidatos = async (req, res) => {
  const vacante = await Vacante.findById(req.params.id).lean();
  if (vacante.autor.toString() !== req.user._id.toString()) {
    return next();
  }

  if (!vacante) return next();

  res.render("candidatos", {
    pagina: `Candidatos - ${vacante.titulo}`,
    cerrarSesion: true,
    nombre: req.user.nombre,
    imagen: req.user.imagen,
    candidatos: vacante.candidatos,
  });
};

export {
  formularioNuevaVacante,
  agregarVacante,
  mostrarVacante,
  formularioEditarVacante,
  editarVacante,
  validarVacante,
  eliminarVacante,
  subirCV,
  contactar,
  mostrarCandidatos,
};
