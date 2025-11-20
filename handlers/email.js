import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const enviar = async (opciones) => {
  const { usuario, resetUrl } = opciones;

  await transport.sendMail({
    from: "DevJobs <noreply@devjobs.com>",
    to: usuario.email,
    subject: "Reestablecer contraseña",
    text: "Reestablecer contraseña",
    html: `
        <p>Hola ${usuario.nombre}, para reestablecer tu contraseña presiona en el siguiente enlace:</p>
        <a href=${resetUrl}>Reestablecer contraseña</a>
    `,
  });
};

export { enviar };
