import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alerta } from '../components/Alerta';
import { clienteAxios } from '../config/clienteAxios';

export const OlvidePassword = () => {
  const [email,setEmail]=useState('');
  const [alerta,setAlerta]=useState({});

  const handleSubmit = async e => {
    e.preventDefault();
    if(email==='' || email.length<6){
      setAlerta({
        msg:"El Correo Electronico Es Obligatorio",
        error:true,
      });
      return
    }

    try{
      const { data } = await clienteAxios.post(`/usuarios/olvide-password`,{email});
      console.log(data);
      setAlerta({
        msg: data.msg,
        error:false,
      });
    }catch(error){
      setAlerta({
        msg:error.response.data.msg,
        error:true,
      });
    }
  }

  const { msg } = alerta;
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize p-10">Recupera el Acceso y no pierdas tus <span className="text-slate-700">Proyectos</span></h1>
      { msg && <Alerta alerta={alerta}/>}
      <form className="my-10 bg-white shadow rounded-lg p-10 m-5" onSubmit={handleSubmit}>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Ejemplo@hotmail.com"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e=> setEmail(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Recuperar Contraseña"
          className="bg-sky-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between px-5 py-2">
        <Link to="/registrar" className='block text-center my-5 text-slate-500 uppercase text-sm'> ¿No tienes Una Cuenta? Registrate</Link>
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'> ¿Ya tienes una Cuenta? Inicia Sesión</Link>
      </nav>
    </>
  )
}