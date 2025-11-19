import mongoose from "mongoose";
import slug from "slug";
import shortid from "shortid";
mongoose.Promise = global.Promise;

const vacanteSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: "El nombre de la vacante es obligatorio",
    trim: true,
  },
  empresa: {
    type: String,
    trim: true,
  },
  ubicacion: {
    type: String,
    trim: true,
    required: "La ubicacion es obligatoria",
  },
  salario: {
    type: String,
    default: 0,
    trim: true,
  },
  contrato: {
    type: String,
    trim: true,
  },
  descripcion: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    lowerCase: true,
  },
  skills: [String],
  candidatos: [
    {
      nombre: String,
      email: String,
      cv: String,
    },
  ],
  autor: {
    type: mongoose.Schema.ObjectId,
    ref: "Usuario",
    required: "El autor es obligatorio",
  },
});

vacanteSchema.pre("save", function (next) {
  // Crear url
  const url = slug(this.titulo);
  this.url = `${url}-${shortid.generate()}`;
  next();
});

const Vacante = mongoose.model("Vacante", vacanteSchema);

export default Vacante;
