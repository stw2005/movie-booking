import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthProvider';

export default function AdminLayout() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/admin/bookings', label: 'Bookings' },
        { path: '/admin/manage', label: 'Edit Movies' },
        { path: '/admin/movies', label: 'View Movies' },
    ];

    return (
        <div>
            <header className="glass-panel" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                borderRadius: '50px',
                margin: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h1 className="text-gradient" style={{ margin: 0, fontSize: '1.8em' }}>Admin Dashboard</h1>
                </div>

                <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={location.pathname.startsWith(item.path) ? 'btn-primary' : 'btn-secondary'}
                        >
                            {item.label}
                        </button>
                    ))}
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="btn-danger"
                        style={{ marginLeft: '10px' }}
                    >
                        Logout
                    </button>
                </nav>
            </header>
            <div className="container animate-fade-in">
                <Outlet />
            </div>
        </div>
    );
}
