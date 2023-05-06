import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import axios from 'axios';
import { Alerta } from '../components/Alerta';
import { clienteAxios } from "../config/clienteAxios";

export const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState('');
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios(url);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    }
    confirmarCuenta();
  }, []);

  const { msg } = alerta
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize p-10">Confirma tu cuenta para crear Nuevos <span className="text-slate-700">Proyectos</span></h1>
      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl">
        {msg && <Alerta alerta={alerta} />}

        {cuentaConfirmada && (<Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'> Inicia Sesión</Link>)}
      </div>
    </>
  )
}