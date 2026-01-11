import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });
                const data = await res.json();

                if (res.ok) {
                    login(data.token, data.user);
                } else {
                    alert(data.error || 'Login failed');
                }
            } else {
                const res = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role }),
                });
                if (res.ok) {
                    alert('Registration successful! Please login.');
                    setIsLogin(true);
                } else {
                    const data = await res.json();
                    alert(data.error || 'Registration failed');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Authentication failed');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                width: '100%',
                maxWidth: '450px',
                padding: '40px',
                borderRadius: '24px',
                textAlign: 'center'
            }}>
                <h1 className="text-gradient" style={{ fontSize: '3em', marginBottom: '10px' }}>
                    Cinephile
                </h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    {isLogin ? 'Welcome back to the theater' : 'Join the premiere experience'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'left' }}>
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div style={{ textAlign: 'left' }}>
                            <label>Role</label>
                            <select value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
                        {isLogin ? 'Enter Theater' : 'Get Pass'}
                    </button>
                </form>

                <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>
                    {isLogin ? "New here? " : "Already have a pass? "}
                    <span
                        onClick={() => setIsLogin(!isLogin)}
                        style={{
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            fontWeight: 600,
                            textDecoration: 'none'
                        }}
                    >
                        {isLogin ? 'Register now' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
}
