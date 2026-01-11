import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [tickets, setTickets] = useState(1);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                setMovies(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMovies();
    }, []);

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            await api.post('/bookings', { userId: user.id, movieId: selectedMovie.id, tickets });
            alert('Tickets Booked Successfully! Enjoy the show.');
            setSelectedMovie(null);
        } catch (err) { alert('Booking failed'); }
    };

    return (
        <div >
            <header className="glass-panel" style={{
                position: 'sticky',
                top: 20,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                margin: '20px',
                borderRadius: '50px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <h2 className="text-gradient" style={{ fontSize: '1.5em' }}>Cinephile</h2>
                    <span style={{ color: 'var(--text-muted)', borderLeft: '1px solid var(--glass-border)', paddingLeft: '15px' }}>
                        Now Showing
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span style={{ fontWeight: 500 }}>Hello, {user.username}</span>
                    <button onClick={() => { logout(); navigate('/'); }} className="btn-secondary" style={{ padding: '8px 20px' }}>
                        Logout
                    </button>
                </div>
            </header>

            <div className="container animate-fade-in">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '40px'
                }}>
                    {movies.map(movie => (
                        <div key={movie.id} className="movie-card glass-panel" onClick={() => setSelectedMovie(movie)} style={{ cursor: 'pointer' }}>
                            <div style={{ overflow: 'hidden', height: '400px' }}>
                                {movie.posterUrl ? (
                                    <img src={`/api${movie.posterUrl}`} alt={movie.title} />
                                ) : (
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'var(--bg-dark)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-muted)'
                                    }}>No Poster</div>
                                )}
                            </div>

                            <div className="movie-card-content">
                                <h3 style={{ fontSize: '1.4em', marginBottom: '8px' }}>{movie.title}</h3>
                                {movie.director && <div style={{ color: 'var(--primary)', fontSize: '0.9em', marginBottom: '8px' }}>Dir. {movie.director}</div>}

                                <p className="movie-description">
                                    {movie.description}
                                </p>

                                <button className="btn-primary" style={{ width: '100%', marginTop: 'auto' }}>
                                    View & Book
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedMovie && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(10px)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }} onClick={() => setSelectedMovie(null)}>
                    <div className="glass-panel animate-fade-in" style={{
                        width: '100%',
                        maxWidth: '1000px',
                        borderRadius: '24px',
                        background: '#0f1126',
                        display: 'flex',
                        overflow: 'hidden',
                        maxHeight: '90vh'
                    }} onClick={e => e.stopPropagation()}>

                        {/* Left: Poster */}
                        <div style={{ flex: 1, minWidth: '400px', background: 'black', position: 'relative' }}>
                            {selectedMovie.posterUrl ? (
                                <img src={`/api${selectedMovie.posterUrl}`} alt={selectedMovie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#666' }}>No Poster</div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div style={{ flex: 1.2, padding: '40px', overflowY: 'auto' }}>
                            <h2 style={{ fontSize: '2.5em', marginBottom: '10px', lineHeight: 1.1 }}>{selectedMovie.title}</h2>
                            {selectedMovie.director && <h4 style={{ color: 'var(--primary)', marginBottom: '20px', fontWeight: 500 }}>Directed by {selectedMovie.director}</h4>}

                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.1em', marginBottom: '30px' }}>
                                {selectedMovie.description}
                            </p>

                            {selectedMovie.cast && (
                                <div style={{ marginBottom: '30px' }}>
                                    <h5 style={{ marginBottom: '10px', color: '#fff', fontSize: '0.9em', textTransform: 'uppercase', letterSpacing: '1px' }}>Starring</h5>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {selectedMovie.cast.split(',').map((actor, idx) => (
                                            <span key={idx} className="tag" style={{ fontSize: '0.9em', padding: '6px 12px' }}>{actor.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <hr style={{ borderColor: 'var(--glass-border)', margin: '30px 0' }} />

                            <h3 style={{ marginBottom: '15px' }}>Book Tickets</h3>
                            <form onSubmit={handleBooking}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label>Seat Count</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={tickets}
                                            onChange={e => setTickets(e.target.value)}
                                        />
                                    </div>
                                    <div style={{ flex: 2, display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                                        <button type="submit" className="btn-primary" style={{ flex: 1, height: '52px' }}>Confirm Booking</button>
                                        <button type="button" onClick={() => setSelectedMovie(null)} className="btn-secondary" style={{ height: '52px' }}>Close</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
