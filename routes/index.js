import express from "express";
import { mostrarTrabajos } from "../controllers/homeController.js";
import {
  agregarVacante,
  editarVacante,
  formularioEditarVacante,
  formularioNuevaVacante,
  mostrarVacante,
} from "../controllers/vacanteController.js";
import {
  crearCuenta,
  formularioCrearCuenta,
  validarRegistro,
} from "../controllers/usuarioController.js";

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

// Crear cuentas
router.get("/crear-cuenta", formularioCrearCuenta);
router.post("/crear-cuenta", validarRegistro, crearCuenta);

export default router;
