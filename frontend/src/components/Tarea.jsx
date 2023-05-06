import { FormatearFecha } from "../helpers/FormatearFecha";
import { useAdmin } from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

export const Tarea = ({ tarea }) => {
    const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea;
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos();
    const admin = useAdmin();
    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="text-2xl p-1">{nombre}</p>
                <p className="text-sm p-1 text-gray-500 uppercase">{descripcion}</p>
                <p className="text-sm p-1 text-gray-500">{FormatearFecha(fechaEntrega)}</p>
                <p className="text-sm text-gray-600 p-1 uppercase">Prioridad: {prioridad}</p>
                { estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Completada por {tarea.completado.nombre}</p>}
            </div>

            <div className="flex flex-col lg:flex-row gap-2">
                {admin && (<button onClick={() => handleModalEditarTarea(tarea)} className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Editar Tarea</button>)}
                <button onClick={() => completarTarea(_id)} className={`${estado ? 'bg-sky-600' : 'bg-gray-600'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}>{estado ? 'Completa' : 'Incompleta'}</button>
                {admin && (<button onClick={() => handleModalEliminarTarea(tarea)} className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Eliminar Tarea</button>)}
            </div>
        </div>
    )
}