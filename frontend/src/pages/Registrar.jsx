import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alerta } from '../components/Alerta';
import { clienteAxios } from '../config/clienteAxios';

export const Registrar = () => {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repetirPassword, setRepetirPassword] = useState('');
  const [alerta, setAlerta] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if ([nombre, email, password, repetirPassword].includes('')) {
      setAlerta({
        msg: 'Todos los Campos son Obligatorios',
        error: true
      })
      return
    }

    if (password !== repetirPassword) {
      setAlerta({
        msg: 'Las contraseñas no Coinciden',
        error: true
      })
      return
    }

    if (password.length < 6) {
      setAlerta({
        msg: 'La contrañseña debe tener minimo 6 Caracteres',
        error: true
      })
      return
    }
    setAlerta({});

    //Crear Usuario en API
    try{
      const {data} = await clienteAxios.post(`/usuarios`,{nombre,email,password})
      setAlerta({
        msg:data.msg,
        error:false
      });

      setNombre('');
      setEmail('');
      setPassword('');
      setRepetirPassword('');
    }catch(error){
      setAlerta({
        msg:error.response.data.msg,
        error:true
      })
    }
  }

  const { msg } = alerta

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize p-10">Crea tu cuenta para administrar tus <span className="text-slate-700">Proyectos</span></h1>

      {msg && <Alerta alerta={alerta} />}

      <form className="my-10 bg-white shadow rounded-lg p-10 m-5" onSubmit={handleSubmit}>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="nombre">
            Nombre(s)
          </label>
          <input
            id="nombre"
            type="nombre"
            placeholder="Nombre(s)"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="email">
            Correo Electronico
          </label>
          <input
            id="email"
            type="email"
            placeholder="ejemplo@hotmail.com"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}

          />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-gray-600 block text-xl font-bold"
            htmlFor="password2">
            Repetir Contraseña
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repetir Contraseña"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={repetirPassword}
            onChange={e => setRepetirPassword(e.target.value)}

          />
        </div>

        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-sky-600 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between px-10 py-2">
        <Link to="/" className='block text-center my-5 text-slate-500 uppercase text-sm'> ¿Ya tienes una Cuenta? Inicia Sesión</Link>
        <Link to="/olvide-password" className='block text-center my-5 text-slate-500 uppercase text-sm'> Olvide mi Contraseña</Link>
      </nav>
    </>
  )
}