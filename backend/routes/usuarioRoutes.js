import  express  from "express";
import { autenticar, confirmar, olvidePassword, registrar } from '../controllers/usuarioController.js';

const router = express.Router();

//Autenticacion, Registro y Confirmacion de Usuarios

router.post('/',registrar); //Registro Nuevo Usuario
router.post('/login',autenticar); //Autenticar Usuario
router.get('/confirmar/:token',confirmar); //Confirmar Usuario
router.post('/olvide-password',olvidePassword); //Olvido de Contraseña
router.get('/olvide-password/:token',comprobarToken); //Olvido de Contraseña

export default router;