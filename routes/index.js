import express from "express";
import { mostrarTrabajos } from "../controllers/homeController.js";
import {
  agregarVacante,
  editarVacante,
  formularioEditarVacante,
  formularioNuevaVacante,
  mostrarVacante,
} from "../controllers/vacanteController.js";

const router = express.Router();

router.get("/", mostrarTrabajos);

// Crear vacantes
router.get("/vacantes/nueva", formularioNuevaVacante);
router.post("/vacantes/nueva", agregarVacante);

// Mostrar vacante
router.get("/vacantes/:url", mostrarVacante);

// Editar vacante
router.get("/vacantes/editar/:url", formularioEditarVacante);
router.post("/vacantes/editar/:url", editarVacante);

export default router;
