import Proyecto from '../models/Proyecto.js';
import Tarea from '../models/Tarea.js';
import Usuario from '../models/Usuario.js';

const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        '$or': [
            { 'colaboradores': { $in: req.usuario } },
            { 'creador': { $in: req.usuario } }
        ]
    }).select('-tareas');
    res.json(proyectos);
};

const nuevoProyecto = async (req, res) => {
    const proyecto = new Proyecto(req.body);
    proyecto.creador = req.usuario._id;
    try {
        const proyectoAlmacenado = await proyecto.save();
        res.json(proyectoAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerProyecto = async (req, res) => {
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findById(id).populate({ path: 'tareas', populate: { path: 'completado',select:"nombre" } }).populate('colaboradores', "nombre email");
        if (!proyecto) {
            res.status(404).json({ msg: 'Proyecto Inexistente' });
        };

        if (proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };

        //Obtener Tareas del Proyecto
        res.json(
            proyecto
        );

    } catch (error) {
        res.status(404).json({ msg: 'ID de Proyecto Invalido' });
    };
};

const editarProyecto = async (req, res) => {
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findById(id);
        if (!proyecto) {
            res.status(404).json({ msg: 'Proyecto Inexistente' });
        };

        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };
        proyecto.nombre = req.body.nombre || proyecto.nombre;
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion;
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega;
        proyecto.cliente = req.body.cliente || proyecto.cliente;

        try {
            const proyectoAlmacenado = await proyecto.save();
            res.json(proyectoAlmacenado);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: 'ID de Proyecto Invalido' });
    };
};

const eliminarProyecto = async (req, res) => {
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findById(id);
        if (!proyecto) {
            res.status(404).json({ msg: 'Proyecto Inexistente' });
        };

        if (proyecto.creador.toString() !== req.usuario._id.toString()) {
            res.status(403).json({ msg: 'Acceso no Autorizado' });
        };

        try {
            await proyecto.deleteOne();
            res.json({ msg: "Proyecto Eliminado" });
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        res.status(404).json({ msg: 'ID de Proyecto Invalido' });
    };
};

const buscarColaborador = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v ');

    if (!usuario) {
        res.status(404).json({ msg: 'Usuario no Encontrado' });
    }

    res.json(usuario);
};

const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error("Proyecto no Encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("No puedes añadirte a ti mismo como Colaborador");
        return res.status(404).json({ msg: error.message });
    }

    const { email } = req.body
    const usuario = await Usuario.findOne({ email }).select('-confirmado -createdAt -password -token -updatedAt -__v ');

    if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no Encontrado' });
    }

    //No añadir al propietario como Colaborador
    if (proyecto.creador.toString() === usuario._id.toString()) {
        return res.status(404).json({ msg: 'El creador del Proyecto no puede ser un Colaborador' });
    }

    //Revisar si ya esta agregado un usuario
    if (proyecto.colaboradores.includes(usuario._id)) {
        return res.status(404).json({ msg: 'Este usuario ya es un Colaborador' });
    }

    //TODO Todo Bien, Todo Correcto
    proyecto.colaboradores.push(usuario._id);
    await proyecto.save();
    res.json({ msg: "Colaborador Agregado Correctamente" });
};

const eliminarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
        const error = new Error("Proyecto no Encontrado");
        return res.status(404).json({ msg: error.message });
    }

    if (proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no Valida");
        return res.status(404).json({ msg: error.message });
    }

    //TODO Todo Bien, Todo Correcto
    proyecto.colaboradores.pull(req.body.id);
    await proyecto.save();
    res.json({ msg: "Colaborador Eliminado Correctamente" });
};

// const obtenerTareas = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const existeProyecto = await Proyecto.findById(id);
//         if (!existeProyecto) {
//             res.status(404).json({ msg: 'Proyecto Inexistente' });
//         };

//         const tareas = await Tarea.find().where('proyecto').equals(id);
//         res.json(tareas);
//     } catch (error) {
//         res.status(404).json({ msg: 'ID de Proyecto Invalido' });
//     };
// };

export {
    obtenerProyectos,
    nuevoProyecto,
    obtenerProyecto,
    editarProyecto,
    eliminarProyecto,
    buscarColaborador,
    agregarColaborador,
    eliminarColaborador,
}