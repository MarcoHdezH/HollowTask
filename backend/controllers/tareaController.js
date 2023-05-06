import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tarea.js";

const agregarTarea = async (req, res) => {

    const { proyecto } = req.body;

    try {
        const existeProyecto = await Proyecto.findById(proyecto);
        if (!existeProyecto) {
            res.status(404).json({ msg: 'Proyecto Inexistente' });
        };

        if (existeProyecto.creador.toString() !== req.usuario._id.toString()) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };

        try {
            const tareaAlmacenada = await Tarea.create(req.body);
            //Almacenar ID en el Proyecto
            existeProyecto.tareas.push(tareaAlmacenada._id);
            await existeProyecto.save();
            res.json(tareaAlmacenada);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: 'ID Invalido' });
    };
};

const obtenerTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");

        if (!tarea) {
            res.status(404).json({ msg: 'Tarea Inexistente' });
        };

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };

        try {
            res.json(tarea);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: 'ID Invalido' });
    };
};

const actualizarTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");

        if (!tarea) {
            res.status(404).json({ msg: 'Tarea Inexistente' });
        };

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };

        tarea.nombre = req.body.nombre || tarea.nombre;
        tarea.descripcion = req.body.descripcion || tarea.descripcion;
        tarea.prioridad = req.body.prioridad || tarea.prioridad;
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

        try {
            const tareaAlmacenada = await tarea.save();
            res.json(tareaAlmacenada);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: 'ID Invalido' });
    };
};

const eliminarTarea = async (req, res) => {
    const { id } = req.params;
    try {
        const tarea = await Tarea.findById(id).populate("proyecto");

        if (!tarea) {
            res.status(404).json({ msg: 'Tarea Inexistente' });
        };

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };

        try {

            const proyecto = await Proyecto.findById(tarea.proyecto);
            proyecto.tareas.pull(tarea._id);
            await Promise.allSettled([await proyecto.save(),await tarea.deleteOne()])
            res.json({ msg: "Tarea Eliminada con Exito" });
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: 'ID Invalido' });
    };
};

const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if (!tarea) {
        res.status(404).json({ msg: 'Tarea Inexistente' });
    };
    
    if (tarea.proyecto.creador.toString() !== req.usuario._id.toString() && !tarea.proyecto.colaboradores.some(
        (colaborador) => colaborador._id.toString() === req.usuario._id.toString()
    )) {
        res.status(403).json({ msg: 'Acceso no Autorizado' });
    };

    tarea.estado = !tarea.estado;
    tarea.completado=req.usuario._id;
    await tarea.save();
    const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate("completado");
    res.json(tareaAlmacenada);
};

export {
    agregarTarea,
    obtenerTarea,
    actualizarTarea,
    eliminarTarea,
    cambiarEstado
};