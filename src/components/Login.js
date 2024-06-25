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
            const response = await axios.post('https://backend-paris.onrender.com/api/login', { username, password });
            if (response.data.success) {
                // Cambiar aquí a la ruta deseada luego del login exitoso
                history.push('/create');
            } else {
                alert('Login failed!');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login error');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                    style={{ margin: 5, padding: 10, width: '20%', minWidth: '150px' }}
                />
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    style={{ margin: 5, padding: 10, width: '20%', minWidth: '150px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;
