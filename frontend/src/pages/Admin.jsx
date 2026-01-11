import { useEffect, useState, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
    const { user, logout } = useContext(AuthContext);
    const [view, setView] = useState('bookings'); // 'bookings', 'edit_movie', 'movies'
    const [movies, setMovies] = useState([]);
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    // Edit/Add Form State
    const [editingMovie, setEditingMovie] = useState(null); // If null, we are adding. If object, editing.
    const [showForm, setShowForm] = useState(false);

    // Form Inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [poster, setPoster] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchMovies();
        fetchBookings();
    }, [user, navigate]);

    const fetchMovies = async () => {
        try {
            const res = await api.get('/movies');
            setMovies(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSaveMovie = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (poster) formData.append('poster', poster);

        try {
            if (editingMovie) {
                await api.put(`/movies/${editingMovie.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/movies', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            // Reset
            setEditingMovie(null);
            setShowForm(false);
            setTitle('');
            setDescription('');
            setPoster(null);
            fetchMovies();
        } catch (err) {
            alert('Failed to save movie');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this movie?')) return;
        try {
            await api.delete(`/movies/${id}`);
            fetchMovies();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const openAddForm = () => {
        setEditingMovie(null);
        setTitle('');
        setDescription('');
        setPoster(null);
        setShowForm(true);
    };

    const openEditForm = (movie) => {
        setEditingMovie(movie);
        setTitle(movie.title);
        setDescription(movie.description);
        setPoster(null); // Keep old poster unless changed
        setShowForm(true);
    };

    return (
        <div className="container">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Admin Dashboard</h1>
                <nav>
                    <button style={{ background: view === 'bookings' ? '#0056b3' : '#007bff' }} onClick={() => setView('bookings')}>Bookings</button>
                    <button style={{ background: view === 'edit_movie' ? '#0056b3' : '#007bff' }} onClick={() => setView('edit_movie')}>Edit Movie</button>
                    <button style={{ background: view === 'movies' ? '#0056b3' : '#007bff' }} onClick={() => setView('movies')}>Movies</button>
                    <button style={{ backgroundColor: '#dc3545' }} onClick={() => { logout(); navigate('/'); }}>Logout</button>
                </nav>
            </header>

            <main style={{ marginTop: '20px' }}>
                {view === 'bookings' && (
                    <section>
                        <h2>All Bookings</h2>
                        <div className="bookings-list">
                            {bookings.map(b => (
                                <div key={b.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                                    <strong>{b.username}</strong> booked <strong>{b.title}</strong> ({b.tickets} tickets) on {new Date(b.bookingDate).toLocaleDateString()}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {view === 'movies' && (
                    <section>
                        <h2>Movies View (User Perspective)</h2>
                        <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {movies.map(movie => (
                                <div key={movie.id} className="card" style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    {movie.posterUrl && <img src={`/api${movie.posterUrl}`} alt={movie.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />}
                                    <h3>{movie.title}</h3>
                                    <p>{movie.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {view === 'edit_movie' && (
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h2>Manage Movies</h2>
                            <button style={{ background: '#28a745' }} onClick={openAddForm}>+ Add Movie</button>
                        </div>

                        {showForm && (
                            <div className="modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                                <div style={{ background: 'white', padding: '20px', minWidth: '350px', borderRadius: '8px' }}>
                                    <h3>{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
                                    <form onSubmit={handleSaveMovie} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                                        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />

                                        <div>
                                            <label>Poster: </label>
                                            <input type="file" onChange={e => setPoster(e.target.files[0])} accept="image/*" />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                            <button type="button" style={{ background: '#6c757d' }} onClick={() => setShowForm(false)}>Cancel</button>
                                            <button type="submit" style={{ background: '#28a745' }}>Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="movie-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                            {movies.map(movie => (
                                <div key={movie.id} className="card" style={{ border: '1px solid #ccc', padding: '10px' }}>
                                    {movie.posterUrl && <img src={`/api${movie.posterUrl}`} alt={movie.title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />}
                                    <h3>{movie.title}</h3>
                                    <p>{movie.description}</p>
                                    <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <button onClick={() => openEditForm(movie)}>Edit</button>
                                        <button style={{ background: '#dc3545' }} onClick={() => handleDelete(movie.id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}
