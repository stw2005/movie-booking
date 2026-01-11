import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

export default function AdminManageMovies() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this movie?')) return;
        try {
            await api.delete(`/movies/${id}`);
            fetchMovies();
        } catch (err) {
            alert('Failed to delete movie');
        }
    };

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '2em', margin: 0 }}>Manage Library</h2>
                <button
                    onClick={() => navigate('/admin/movie/new')}
                    className="btn-primary"
                    style={{ fontSize: '1.1em', padding: '12px 30px' }}
                >
                    + Add Movie
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '40px' }}>
                {movies.map(movie => (
                    <div key={movie.id} className="movie-card glass-panel">
                        <div style={{ overflow: 'hidden', height: '350px' }}>
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
                        <div className="movie-card-content" style={{ marginTop: '-40px' }}>
                            <h3 style={{ fontSize: '1.4em', marginBottom: '10px' }}>{movie.title}</h3>
                            <p className="movie-description">{movie.description}</p>

                            <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                                <button
                                    onClick={() => navigate(`/admin/movie/edit/${movie.id}`)}
                                    className="btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(movie.id)}
                                    className="btn-danger"
                                    style={{ flex: 1 }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
