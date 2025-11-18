import mongoose from "mongoose";
import slug from "slug";
import shortid from "shortid";
import bcrypt from "bcrypt";
mongoose.Promise = global.Promise;

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  token: String,
  expira: Date,
});

// Metodo para hashear los passwords
usuarioSchema.pre("save", async function (next) {
  // Si el password ya esta hasheado
  if (!this.isModified("password")) {
    return next();
  }
  // Hashear
  const hash = await bcrypt.hash(this.password, 12);
  this.password = hash;
  next();
});

usuarioSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoServerError" && error.code === 11000) {
    next("El correo ya está registrado");
  } else {
    next(error);
  }
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
