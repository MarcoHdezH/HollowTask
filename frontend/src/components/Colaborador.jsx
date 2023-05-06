import useProyectos from "../hooks/useProyectos";

export const Colaborador = ({colaborador}) => {

    const {nombre,email} = colaborador;
    const {handleModalEliminarColaborador } = useProyectos();
    
    return (
        <div className="border-b p-5 flex justify-between items-center">

            <div>
                <p className="text-2xl p-1">{nombre}</p>
                <p className="text-sm p-1 text-gray-500">{email}</p>
            </div>

            <div>
                <button onClick={()=>handleModalEliminarColaborador(colaborador)} className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg" type="button">Eliminar Colaborador</button>
            </div>

        </div>
    )
}