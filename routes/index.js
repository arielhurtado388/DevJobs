import express from "express";
import { mostrarTrabajos } from "../controllers/homeController.js";
import {
  agregarVacante,
  contactar,
  editarVacante,
  eliminarVacante,
  formularioEditarVacante,
  formularioNuevaVacante,
  mostrarCandidatos,
  mostrarVacante,
  subirCV,
  validarVacante,
} from "../controllers/vacanteController.js";
import {
  crearCuenta,
  editarPerfil,
  formularioCrearCuenta,
  formularioEditarPefil,
  formularioIniciarSesion,
  subirImagen,
  validarPerfil,
  validarRegistro,
} from "../controllers/usuarioController.js";
import {
  autenticarUsuario,
  cerrarSesion,
  enviarToken,
  formularioOlvide,
  formularioReestablecer,
  mostrarPanel,
  reestablecer,
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

// Eliminar vacantes
router.delete("/vacantes/eliminar/:id", eliminarVacante);

// Crear cuentas
router.get("/crear-cuenta", formularioCrearCuenta);
router.post("/crear-cuenta", validarRegistro, crearCuenta);

// Autenticar
router.get("/iniciar-sesion", formularioIniciarSesion);
router.post("/iniciar-sesion", autenticarUsuario);
router.get("/cerrar-sesion", verificarUsuario, cerrarSesion);
router.get("/olvide", formularioOlvide);
router.post("/olvide", enviarToken);
router.get("/olvide/:token", formularioReestablecer);
router.post("/olvide/:token", reestablecer);

// Panel de administracion
router.get("/administracion", verificarUsuario, mostrarPanel);

// Editar perfil
router.get("/editar-perfil", verificarUsuario, formularioEditarPefil);
router.post(
  "/editar-perfil",
  verificarUsuario,
  // validarPerfil,
  subirImagen,
  editarPerfil
);

// Recibir mensajes de candidatos
router.post("/vacantes/:url", subirCV, contactar);

// Mostrar candidatos por vacante
router.get(
  "/candidatos/:id",
  verificarUsuario,

  mostrarCandidatos
);

export default router;
