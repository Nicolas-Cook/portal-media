import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {toast} from 'react-toastify';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = isLogin ? 'http://localhost:3000/users/login' : 'http://localhost:3000/users/register';
    const configuration = {
      method: 'post',
      url,
      data: {
        username,
        password,
      },
      withCredentials: true,
    };

    if (!isLogin && password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    axios(configuration)
      .then(() => {
        if (isLogin) {
          navigate('/private');
          toast.success('Login exitoso');
        } else {
          setIsLogin(true);
          toast.success('Usuario registrado');
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message);
      });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/private" />;
  }

  return (
    <div id="login-register">
      <div>
        <h1>{isLogin ? 'Ingresar' : 'Registrarse'}</h1>
        <form onSubmit={handleSubmit}>
          <label>
            <span>Nombre de usuario:</span>
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label>
            <span>Contraseña:</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {!isLogin && ( 
            <label>
              <span>Confirmar Contraseña:</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          )}
          <button type="submit">{isLogin ? 'Ingresar' : 'Registrarse'}</button>
          <p>
            {isLogin ? (
              <a href="#" onClick={toggleForm}>
                No tienes cuenta? Registrate
              </a>
            ) : (
              <a href="#" onClick={toggleForm}>
                Volver al Ingreso
              </a>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
