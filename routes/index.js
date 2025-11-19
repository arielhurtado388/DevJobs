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
  formularioIniciarSesion,
  validarRegistro,
} from "../controllers/usuarioController.js";
import {
  autenticarUsuario,
  mostrarPanel,
  verificarUsuario,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", mostrarTrabajos);

// Crear vacantes
router.get("/vacantes/nueva", verificarUsuario, formularioNuevaVacante);
router.post("/vacantes/nueva", verificarUsuario, agregarVacante);

// Mostrar vacante
router.get("/vacantes/:url", mostrarVacante);

// Editar vacante
router.get("/vacantes/editar/:url", verificarUsuario, formularioEditarVacante);
router.post("/vacantes/editar/:url", verificarUsuario, editarVacante);

// Crear cuentas
router.get("/crear-cuenta", formularioCrearCuenta);
router.post("/crear-cuenta", validarRegistro, crearCuenta);

// Autenticar
router.get("/iniciar-sesion", formularioIniciarSesion);
router.post("/iniciar-sesion", autenticarUsuario);

// Panel de administracion
router.get("/administracion", verificarUsuario, mostrarPanel);

export default router;
