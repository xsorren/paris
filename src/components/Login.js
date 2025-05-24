import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "inmoParis2024") {
            localStorage.setItem("isAdmin", "true");
            localStorage.setItem("welcomeMessage", "Ahora sos administrador y podés agregar propiedades");
            navigate('/admin');// Redirigir al panel de administración
        } else {
            alert("Usuario o contraseña incorrectos.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Usuario"
                    style={{ margin: 5, padding: 10, width: '20%', minWidth: '150px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    style={{ margin: 5, padding: 10, width: '20%', minWidth: '150px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
