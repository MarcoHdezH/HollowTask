import { Link, useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import ModalFormulario from "../components/ModalFormulario";
import { Tarea } from "../components/Tarea";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import { Alerta } from "../components/Alerta";
import { Colaborador } from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import { useAdmin } from "../hooks/useAdmin";
import io from 'socket.io-client'

let socket;

export const Proyecto = () => {

    const params = useParams();
    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta,submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyectos();

    const admin = useAdmin();

    useEffect(() => {
        obtenerProyecto(params.id);
    }, []);

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL);
        socket.emit('Abrir proyecto', params.id);
    }, []);

    useEffect(() => {
        socket.on("tarea agregada", tareaNueva => {
            if (tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })

        socket.on('tarea eliminada', tareaEliminada => {
            if (tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        })

        socket.on('tarea actualizada', tareaActualizada => {
            if (tareaActualizada.proyecto._id === proyecto._id) {
                actualizarTareaProyecto(tareaActualizada)
            }
        })

        socket.on('nuevo estado', nuevoEstadoTarea => {
            if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })
    const { nombre } = proyecto;

    const { msg } = alerta;

    return (
        <>
            <div className="flex justify-between">
                <h1 className="font-black text-4xl text-center">{nombre}</h1>

                {admin && (<div className="felx items-center gap-2 text-gray-400 hover:text-black">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                    <Link className="uppercase font-bold" to={`/proyectos/editar/${params.id}`}>Editar</Link>
                </div>)}

            </div>

            {admin && (<button onClick={handleModalTarea} type="button" className="flex gap-2 items-center justify-center text-sm px-5 mt-3 py-4 w-full md:w-auto rounded-lg uppercase font-bold bg-sky-400 text-white text-center"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
                Nueva Tarea
            </button>)}

            <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

            <div className="bg-white shadow mt-10 rounded-lg">
                {proyecto.tareas?.length ? proyecto.tareas?.map(tarea => (<Tarea key={tarea._id} tarea={tarea} />))
                    : <p className="text-center my-5 p-10">No hay Tareas en este Proyecto</p>}
            </div>

            {admin && (<><div className="flex items-center justify-between mt-10">
                <p className="font-bold text-xl">Colaboradores</p>
                <Link className="text-gray-400 uppercase hover:text-black font-bold" to={`/proyectos/nuevo-colaborador/${proyecto._id}`}>Añadir Colaborador</Link>
            </div>

                <div className="bg-white shadow mt-10 rounded-lg">
                    {proyecto.colaboradores?.length ? proyecto.colaboradores?.map(colaborador => (<Colaborador key={colaborador._id} colaborador={colaborador} />))
                        : <p className="text-center my-5 p-10">No hay Colaboradores en este Proyecto</p>}
                </div></>)}
            <ModalFormulario />
            <ModalEliminarTarea />
            <ModalEliminarColaborador />
        </>
    )
}