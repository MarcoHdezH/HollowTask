import { generarID } from "../helpers/generarIdD.js";
import { generarJWT } from "../helpers/generarJWT.js";
import Usuario from "../models/Usuario.js";

const registrar = async (req, res) => {

    //Evitar Registros Duplicados
    const { email } = req.body;
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
        const error = new Error('Usuario ya Registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const usuario = new Usuario(req.body);
        usuario.token = generarID();
        const usuarioAlmacenado = await usuario.save();
        res.json(usuarioAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //Comprobar si Existe el Usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("El Usuario no Existe");
        return res.status(404).json({ msg: error.message });
    }

    //Comprobar si el Usuario esta Confirmado
    if (!usuario.confirmado) {
        const error = new Error("Tu Cuenta aun no ha sido Verificada");
        return res.status(403).json({ msg: error.message });
    }

    //Comprobar Contraseña
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id),
        });
    } else {
        const error = new Error("Contraseña Incorrecta");
        return res.status(403).json({ msg: error.message });
    }
};

const confirmar = async (req, res) => {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({ token });
    if (!usuarioConfirmar) {
        const error = new Error("Token no Valido");
        return res.status(403).json({ msg: error.message });
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario Verificado Correctamente' });
    } catch (error) {
        console.log(error);
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
        const error = new Error("El Usuario no Existe");
        return res.status(404).json({ msg: error.message });
    }

    try {
        usuario.token = generarID();
        await usuario.save();
        res.json({ msg: "Hemos enviado un Correo con Instrucciones para Cambiar su Contraseña" });
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    const tokenValido = await Usuario.findOne({ token });
    if (tokenValido) {
        res.json({ msg: "Token Valido" });
    } else {
        const error = new Error("Token No Valido");
        return res.status(404).json({ msg: error.message });
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = password;
        usuario.token = "";
        try {
            await usuario.save();
            res.json({ msg: "Contraseña Modificada con Exito" })
        } catch (error) {
            console.log(error);
        }
    } else {
        const error = new Error("Token No Valido");
        return res.status(404).json({ msg: error.message });
    }
};

const perfil = async (req, res) => {
    const { usuario } = req;
    res.json(usuario);
}

export { registrar, autenticar, confirmar, olvidePassword, comprobarToken, nuevoPassword,perfil};
