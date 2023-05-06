import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {

    const { email, nombre, token } = datos;

    // const transport = nodemailer.createTransport({
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //       user: process.env.EMAIL_USER,
    //       pass: process.env.EMAIL_PASS
    //     }
    // });

    const transport = nodemailer.createTransport({
        service : 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Informacion de Email
    const info = await transport.sendMail({
        from: '"Hollow Task - Administrador de Proyectos" <soporte@hollowTask.com>',
        to: email,
        subject: "Hollow Task - Comprobar Cuenta",
        text: "Querido Usuario, favor de confirmar tu cuenta en Hollow Task",
        html: `<p>Bienvenido ${nombre}, necesitamos de tu ayuda.</p>
               <p>Tu cuenta ya casi esta lista, solo debes comprobarla en el siguiente enlace:
               <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a></p>
               <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    });
}

export const emailOlvidePassword = async (datos) => {

    //TODO : Configurar Variables de Entorno

    const { email, nombre, token } = datos;

    const transport = nodemailer.createTransport({
        service : 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    //Informacion de Email
    const info = await transport.sendMail({
        from: '"Hollow Task - Administrador de Proyectos" <soporte@hollowTask.com>',
        to: email,
        subject: "Hollow Task - Restablecer Contraseña",
        text: "Correo de Solicitud de Restablecimiento de Contraseña",
        html: `
               <p>Sigue el Siguiente enlace Para Restablecer Contraseña:
               <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Restablecer Contraseña</a></p>
               <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>`
    });
}