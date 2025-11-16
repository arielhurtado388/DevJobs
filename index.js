import express from "express";
import router from "./routes/index.js";
import { engine } from "express-handlebars";

const app = express();

// Habilitar handlebars
app.engine(
  "handlebars",
  engine({
    defaultLayout: "layout",
  })
);
app.set("view engine", "handlebars");

// Carpeta publica
app.use(express.static("public"));

// Routing
app.use("/", router);

app.listen(5000);
