import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Alerta } from "../components/Alerta"
import { clienteAxios } from "../config/clienteAxios"

export const NuevoPassword = () => {

  const [password,setPassword]=useState('');
  const [tokenValido, setTokenValido] = useState(false);
  const [alerta, setAlerta] = useState({});
  const [passwordModificado, setPasswordModificado] = useState(false);
  const params = useParams();
  const { token } = params;
  useEffect(() => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`);
        setTokenValido(true);
      } catch (error) {
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        })
      }
    }
    comprobarToken();
  }, []);

  const handleSubmit = async e =>{
    e.preventDefault();

    if(password.length<6){
      setAlerta({
        msg:"La Contraseña debe tener un minimo de 6 Caracteres",
        error:true,
      })
      return
    }

    try{
      const url=`usuarios/olvide-password/${token}`;
      const { data } = await clienteAxios.post(url,{password});
      setAlerta({
        msg:data.msg,
        error:false,
      });
      setPasswordModificado(true);
    }catch(error){
      setAlerta({
        msg:error.response.data.msg,
        error:true,
      })
    }
  }

  const { msg } = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize p-10">Restablece tu contraseña para recuperar tus <span className="text-slate-700">Proyectos</span></h1>

      {msg && <Alerta alerta={alerta} />}

      {tokenValido && (
        <form className="my-10 bg-white shadow rounded-lg p-10 m-5" onSubmit={handleSubmit}>
          <div className="my-5">
            <label
              className="uppercase text-gray-600 block text-xl font-bold"
              htmlFor="password">
              Nueva Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Nueva Contraseña"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e=>setPassword(e.target.value)}
            />
          </div>

          <input
            type="submit"
            value="Restablecer Contraseña"
            className="bg-sky-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
          />
        </form>
      )
      }
      {passwordModificado && (<Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'> Iniciar Sesión</Link>)}
    </>
  )
}