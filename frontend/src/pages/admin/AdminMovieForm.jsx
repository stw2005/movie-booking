import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';

export default function AdminMovieForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [title, setTitle] = useState('');
    const [director, setDirector] = useState('');
    const [description, setDescription] = useState('');
    const [cast, setCast] = useState('');
    const [poster, setPoster] = useState(null);
    const [currentPoster, setCurrentPoster] = useState(null);

    useEffect(() => {
        if (isEdit) fetchMovie();
    }, [id]);

    const fetchMovie = async () => {
        try {
            const res = await api.get('/movies');
            const movie = res.data.find(m => m.id === parseInt(id));
            if (movie) {
                setTitle(movie.title);
                setDescription(movie.description);
                setDirector(movie.director || '');
                setCast(movie.cast || '');
                setCurrentPoster(movie.posterUrl);
            } else {
                alert('Movie not found');
                navigate('/admin/manage');
            }
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('director', director);
        formData.append('cast', cast);
        if (poster) formData.append('poster', poster);

        try {
            if (isEdit) {
                await api.put(`/movies/${id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/movies', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/admin/manage');
        } catch (err) {
            alert('Failed to save movie: ' + (err.response?.data?.error || err.message));
        }
    };

    const castArray = cast.split(',').filter(c => c.trim() !== '');

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '40px', borderRadius: '24px' }}>
                <h2 style={{ marginBottom: '30px', fontSize: '2em' }} className="text-gradient">
                    {isEdit ? 'Edit Feature' : 'New Release'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label>Title</label>
                            <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Movie Title" />
                        </div>
                        <div>
                            <label>Director</label>
                            <input value={director} onChange={e => setDirector(e.target.value)} placeholder="Director Name" />
                        </div>
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows="5" placeholder="Plot Summary..." style={{ resize: 'vertical' }} />
                    </div>

                    <div>
                        <label>Cast (comma separated)</label>
                        <input value={cast} onChange={e => setCast(e.target.value)} placeholder="Actor 1, Actor 2, Actor 3" />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                            {castArray.map((actor, idx) => (
                                <span key={idx} className="tag">{actor.trim()}</span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label>Poster Image</label>
                        <div style={{
                            border: '2px dashed var(--glass-border)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'rgba(0,0,0,0.2)'
                        }} onClick={() => document.getElementById('poster-upload').click()}>
                            <input id="poster-upload" type="file" onChange={e => setPoster(e.target.files[0])} accept="image/*" style={{ display: 'none' }} />
                            {poster ? (
                                <p style={{ color: 'var(--primary)' }}>Selected: {poster.name}</p>
                            ) : (
                                <p style={{ color: 'var(--text-muted)' }}>Click to Upload Poster</p>
                            )}
                        </div>
                        {currentPoster && !poster && (
                            <div style={{ marginTop: '15px' }}>
                                <p style={{ fontSize: '0.9em', color: 'var(--text-muted)' }}>Current Poster:</p>
                                <img src={`/api${currentPoster}`} alt="Current" style={{ height: '100px', borderRadius: '8px', marginTop: '5px' }} />
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 2, padding: '15px' }}>
                            {isEdit ? 'Update Movie' : 'Publish Movie'}
                        </button>
                        <button type="button" onClick={() => navigate('/admin/manage')} className="btn-secondary" style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
