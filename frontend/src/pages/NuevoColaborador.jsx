import { useEffect } from "react"
import { FormularioColaborador } from "../components/FormularioColaborador"
import useProyectos from "../hooks/useProyectos";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Alerta } from "../components/Alerta";

export const NuevoColaborador = () => {

    const {obtenerProyecto,proyecto,cargando,colaborador,agregarColaborador,alerta} = useProyectos();
    const params = useParams();

    useEffect(()=>{
        obtenerProyecto(params.id)
    },[]);

    if(!proyecto?._id) return <Alerta alerta={alerta}/>

    return (
        cargando ? <Spinner/> :
        <>
            <h1 className="text-4xl font-black p-5 text-center">Añadir Colaborador(a) al Proyecto de {proyecto.nombre}</h1>

            <div className="mt-10 flex justify-center">
                <FormularioColaborador/>
            </div>

            {cargando ? <Spinner/> : colaborador?._id &&(
                <div className="flex justify-center mt-10">
                    <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
                        <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>

                        <div className="flex justify-between">
                            <p className="text-xl">{colaborador.nombre}</p>
                            <button onClick={()=>agregarColaborador({email:colaborador.email})} className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm" type="button">Agregar al Proyecto</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    )
}