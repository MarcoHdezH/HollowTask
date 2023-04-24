import express from 'express';
import dotenv from "dotenv";
import { conectarDB } from './config/db.js';
import router from './routes/usuarioRoutes.js';

const app = express();

dotenv.config();

conectarDB();

//Routing
app.use("/api/Usuarios",router);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el Puerto ${PORT}`);
})