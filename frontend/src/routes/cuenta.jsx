import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';

const Cuenta = () => {
    const { isAuthenticated, loading } = useAuth(true);
    const [username, setUsername] = useState('');
    const [isInfo, setIsInfo] = useState(true);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        axios.get('http://localhost:3000/users/session', {
            withCredentials: true,
          })
          .then((response) => {
            if (response.status === 200) {
              setUsername(response.data.username);
            }
          })
          .catch((error) =>{
            console.error(error);
          });
      };
  
      if (isAuthenticated && !loading) {
        fetchUserInfo();
      }
    }, [isAuthenticated, loading]);

    const handleChangePassword = () => {
        if (newPassword !== confirmNewPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
      
        axios.post('http://localhost:3000/users/change-password', {
          username,
          oldPassword,
          newPassword,
        }, { withCredentials: true })
        .then((response) => {
          if (response.status === 200) {
            toast.success('Contraseña cambiada');
            setIsInfo(true);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error(error.response.data.message);
        });
      };
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!isAuthenticated) {
      return <Navigate to="/" />;
    }
  
    return (
      <div id="account-info">
        <h2>{isInfo ? 'Información de cuenta' : 'Cambiar contraseña'}</h2>
        {isInfo ? (
          <>
          <p>
            Nombre de usuario: <input
              type="text"
              value={username}
              readOnly
            />
          </p>
          <button onClick={() => setIsInfo(false)}>
                Cambiar contraseña
          </button>
          </>
        ) : (
        <>
            <p>
                <label>
                    Contraseña actual:
                    <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    />
                </label>
            </p>
            <p>
                <label>
                    Nueva contraseña:
                    <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    />
                </label>
            </p>
            <p>
                <label>
                    Repetir contraseña:
                    <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                </label>
            </p>
            <button onClick={handleChangePassword}>
            Cambiar contraseña
            </button>
            <button onClick={() => setIsInfo(true)}>
            Volver a información
            </button>
      </>
    )}
  </div>
);
  };

export default Cuenta;