import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api';

export default function AdminMovies() {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movies');
                setMovies(res.data);
            } catch (err) { console.error(err); }
        };
        fetchMovies();
    }, []);

    return (
        <section>
            <h2 style={{ fontSize: '2em', marginBottom: '30px' }}>Preview (User View)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
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
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedMovie && createPortal(
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
                    zIndex: 9999,
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

                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button type="button" onClick={() => setSelectedMovie(null)} className="btn-primary" style={{ height: '52px', minWidth: '120px' }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </section>
    );
}
