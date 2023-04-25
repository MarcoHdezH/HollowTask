import  express  from "express";
import { autenticar, comprobarToken, confirmar, nuevoPassword, olvidePassword, registrar } from '../controllers/usuarioController.js';

const router = express.Router();

//Autenticacion, Registro y Confirmacion de Usuarios

router.post('/',registrar); //Registro Nuevo Usuario
router.post('/login',autenticar); //Autenticar Usuario
router.get('/confirmar/:token',confirmar); //Confirmar Usuario
router.post('/olvide-password',olvidePassword); //Olvido de Contraseña

//Cambio Y Generar Nueva Contraseña
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword);

export default router;