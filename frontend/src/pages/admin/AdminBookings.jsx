import { useEffect, useState } from 'react';
import api from '../../api';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings');
                setBookings(res.data);
            } catch (err) { console.error(err); }
        };
        fetchBookings();
    }, []);

    return (
        <section>
            <h2 style={{ fontSize: '2em', marginBottom: '30px' }}>Current Bookings</h2>
            <div className="bookings-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {bookings.map(b => (
                    <div key={b.id} className="glass-panel" style={{
                        padding: '25px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '16px'
                    }}>
                        <div>
                            <div style={{ fontSize: '1.4em', fontWeight: 'bold', marginBottom: '5px' }}>{b.title}</div>
                            <div style={{ color: 'var(--text-muted)' }}>
                                Booked by: <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{b.username}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '2em', fontWeight: 'bold', color: 'var(--secondary)' }}>
                                {b.tickets} <span style={{ fontSize: '0.5em', color: 'var(--text-muted)' }}>Tickets</span>
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9em' }}>
                                {new Date(b.bookingDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
                {bookings.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No bookings active.</p>}
            </div>
        </section>
    );
}
