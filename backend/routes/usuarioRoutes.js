import  express  from "express";
import { autenticar, registrar } from '../controllers/usuarioController.js';

const router = express.Router();

//Autenticacion, Registro y Confirmacion de Usuarios

router.post('/',registrar); //Registro Nuevo Usuario
router.post('/login',autenticar); //Registro Nuevo Usuario


export default router;