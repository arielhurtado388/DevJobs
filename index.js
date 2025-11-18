import mongoose from "mongoose";
import db from "./config/db.js";
import express from "express";
import router from "./routes/index.js";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { seleccionarSkills } from "./helpers/handlebars.js";

dotenv.config({ path: ".env" });

const app = express();

// Habilitar lectura de datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "layout",
    helpers: { seleccionarSkills },
  })
);
app.set("view engine", "handlebars");

// Carpeta publica
app.use(express.static("public"));

// Mantener en sesion la conexion a MongoDB
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

// Routing
app.use("/", router);

app.listen(process.env.PORT, () => {
  console.log(`Servidor en el puerto ${process.env.PORT}`);
});
