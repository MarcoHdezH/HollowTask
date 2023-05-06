import express from 'express';
import dotenv from "dotenv";
import cors from 'cors';
import { conectarDB } from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();

app.use(express.json());

dotenv.config();

conectarDB();

//Configuracion de Cors
const whitelist = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            //Consultar API
            callback(null, true);
        } else {
            //Acceso Denegado API
            callback(new Error("Error En Cors"));
        }
    }
};
app.use(cors(corsOptions))

//Routing
app.use("/api/Usuarios", usuarioRoutes);
app.use("/api/Proyectos", proyectoRoutes);
app.use("/api/Tareas", tareaRoutes);

const PORT = process.env.PORT || 4000;

const Servidor = app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el Puerto ${PORT}`);
})

//Socket.io
import { Server } from 'socket.io'

const io = new Server(Servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL,
    }
});

io.on("connection", (socket) => {

    // Definir los eventos de socket io
    socket.on("Abrir proyecto", (proyecto) => {
        socket.join(proyecto);
    });

    socket.on("nueva tarea", (tarea) => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea agregada", tarea);
    });

    socket.on("eliminar tarea", (tarea) => {
        const proyecto = tarea.proyecto;
        socket.to(proyecto).emit("tarea eliminada", tarea);
    });

    socket.on("actualizar tarea", (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit("tarea actualizada", tarea);
    });

    socket.on("cambiar estado", (tarea) => {
        const proyecto = tarea.proyecto._id;
        socket.to(proyecto).emit("nuevo estado", tarea);
    });
});