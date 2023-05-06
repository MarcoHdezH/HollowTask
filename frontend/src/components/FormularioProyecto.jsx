import { useEffect, useState } from 'react'
import useProyectos from '../hooks/useProyectos';
import { Alerta } from '../components/Alerta';
import { useParams } from 'react-router-dom';

export const FormularioProyecto = () => {
    const [id, setId] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaEntrega, setFechaEntrega] = useState('');
    const [cliente, setCliente] = useState(''); 
    const { alerta,mostrarAlerta,submitProyecto,proyecto } = useProyectos();
    const params = useParams();

    useEffect(()=>{
        if(params.id && proyecto.nombre){
            setId(proyecto._id);
            setNombre(proyecto.nombre);
            setDescripcion(proyecto.descripcion);
            setCliente(proyecto.cliente);
            setFechaEntrega(proyecto.fechaEntrega.split('T')[0]);
        }
    },[params]);

    const handleSubmit = async e => {
        e.preventDefault();

        if ([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los Campos son Obligatorios',
                error: true
            });
            return
        }

        //Pasar los datos Al Provider
        await submitProyecto({id,nombre,descripcion,fechaEntrega,cliente});

        setId(null);
        setNombre('');
        setFechaEntrega('');
        setDescripcion('');
        setCliente('');
    }

    const { msg } = alerta;

    return (
        <form className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow' onSubmit={ handleSubmit }>
            {msg && <Alerta alerta={alerta}/>}
            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='nombre'>Nombre del Proyecto</label>
                <input type='text' id='nombre' placeholder='Nombre de Proyecto' className='border w-full p-2 mt-2 placeholder-gray-400' value={nombre} onChange={e => setNombre(e.target.value)} />
            </div>

            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='fecha-entrega'>Descripción del Proyecto</label>
                <textarea id='descripcion' placeholder='Descripcion del Proyecto' className='border w-full p-2 mt-2 placeholder-gray-400' value={descripcion} onChange={e => setDescripcion(e.target.value)} />
            </div>

            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='fecha-entrega'>Fecha de Entrega Estimada</label>
                <input type='date' id='fecha-entrega' className='border w-full p-2 mt-2 placeholder-gray-400' value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} />
            </div>

            <div className='mb-5'>
                <label className='text-gray-700 uppercase font-bold text-sm' htmlFor='cliente'>Nombre del Cliente</label>
                <input type='text' id='cliente' placeholder='Nombre del Cliente' className='border w-full p-2 mt-2 placeholder-gray-400' value={cliente} onChange={e => setCliente(e.target.value)} />
            </div>

            <input type='submit' value={id ? 'Actualizar Proyecto' : 'Crear Proyecto'} className='bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-800 transition-colors' />
        </form>
    )
}
