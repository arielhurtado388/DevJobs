import mongoose from "mongoose";
import dotenv from "dotenv";
import Vacante from "../models/Vacante.js";
import Usuario from "../models/Usuario.js";

dotenv.config({ path: ".env" });

mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;

db.on("error", (error) => {
  console.log("Error de conexión a MongoDB:", error);
});

db.on("connected", () => {
  console.log("Conectado exitosamente a MongoDB");
});

export default db;
