import express from "express";
import { mostrarTrabajos } from "../controllers/homeController.js";
import {
  agregarVacante,
  editarVacante,
  formularioEditarVacante,
  formularioNuevaVacante,
  mostrarVacante,
  validarVacante,
} from "../controllers/vacanteController.js";
import {
  crearCuenta,
  editarPerfil,
  formularioCrearCuenta,
  formularioEditarPefil,
  formularioIniciarSesion,
  validarPerfil,
  validarRegistro,
} from "../controllers/usuarioController.js";
import {
  autenticarUsuario,
  cerrarSesion,
  mostrarPanel,
  verificarUsuario,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/", mostrarTrabajos);

// Crear vacantes
router.get("/vacantes/nueva", verificarUsuario, formularioNuevaVacante);
router.post(
  "/vacantes/nueva",
  verificarUsuario,
  validarVacante,
  agregarVacante
);

// Mostrar vacante
router.get("/vacantes/:url", mostrarVacante);

// Editar vacante
router.get("/vacantes/editar/:url", verificarUsuario, formularioEditarVacante);
router.post(
  "/vacantes/editar/:url",
  verificarUsuario,
  validarVacante,
  editarVacante
);

// Crear cuentas
router.get("/crear-cuenta", formularioCrearCuenta);
router.post("/crear-cuenta", validarRegistro, crearCuenta);

// Autenticar
router.get("/iniciar-sesion", formularioIniciarSesion);
router.post("/iniciar-sesion", autenticarUsuario);
router.get("/cerrar-sesion", verificarUsuario, cerrarSesion);

// Panel de administracion
router.get("/administracion", verificarUsuario, mostrarPanel);

// Editar perfil
router.get("/editar-perfil", verificarUsuario, formularioEditarPefil);
router.post("/editar-perfil", verificarUsuario, validarPerfil, editarPerfil);

export default router;
