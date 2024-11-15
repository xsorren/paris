// Login.js

import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                'https://backend-paris.onrender.com/auth/login',
                { username, password }
            );
            if (response.data.success) {
                // Almacenar el token en el almacenamiento local
                localStorage.setItem('token', response.data.token);
                history.push('/create');
            } else {
                alert('¡Inicio de sesión fallido!');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            alert('Error en el inicio de sesión');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
                    style={{ margin: 5, padding: 10, width: '20%', minWidth: '150px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    style={{ margin: 5, padding: 10, width: '20%', minWidth: '150px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
