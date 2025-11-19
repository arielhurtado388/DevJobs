import mongoose from "mongoose";
import passport from "passport";
import LocalStrategy from "passport-local";

const Usuario = mongoose.model("Usuario");

// Configurar estrategia de autenticación local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email", // Usar email en lugar de username
      passwordField: "password",
    },
    async (email, password, done) => {
      // Buscar usuario por email
      const usuario = await Usuario.findOne({ email });

      // Verificar si existe el usuario
      if (!usuario)
        return done(null, false, { message: "El usuario no existe" });

      // Verificar contraseña
      const verificarPass = usuario.compararPasswords(password);

      if (!verificarPass)
        return done(null, false, { message: "La contraseña es incorrecta" });

      // Autenticación exitosa
      return done(null, usuario);
    }
  )
);

// Guardar solo el ID del usuario en la sesión
passport.serializeUser((usuario, done) => done(null, usuario._id));

// Recuperar usuario completo usando el ID de la sesión
passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id).exec();
  return done(null, usuario);
});

export default passport;
