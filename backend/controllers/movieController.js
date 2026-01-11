const db = require('../db');
const fs = require('fs');
const path = require('path');

exports.getAllMovies = (req, res) => {
    db.all(`SELECT * FROM movies`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

exports.createMovie = (req, res) => {
    const { title, description, director, cast } = req.body;
    let posterUrl = null;

    if (req.file) {
        posterUrl = '/uploads/' + req.file.filename;
    }

    if (!title) return res.status(400).json({ error: 'Title is required' });

    db.run(`INSERT INTO movies (title, description, director, cast, posterUrl) VALUES (?, ?, ?, ?, ?)`,
        [title, description, director, cast, posterUrl],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title, description, director, cast, posterUrl });
        }
    );
};

exports.updateMovie = (req, res) => {
    const { id } = req.params;
    const { title, description, director, cast } = req.body;

    db.get(`SELECT * FROM movies WHERE id = ?`, [id], (err, movie) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        let posterUrl = movie.posterUrl;

        if (req.file) {
            posterUrl = '/uploads/' + req.file.filename;
            if (movie.posterUrl) {
                const oldPath = path.join(__dirname, '..', movie.posterUrl);
                fs.unlink(oldPath, (err) => {
                    if (err) console.error('Failed to delete old poster:', err);
                });
            }
        }

        db.run(`UPDATE movies SET title = ?, description = ?, director = ?, cast = ?, posterUrl = ? WHERE id = ?`,
            [title || movie.title, description || movie.description, director || movie.director, cast || movie.cast, posterUrl, id],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Movie updated successfully', id, title, description, director, cast, posterUrl });
            }
        );
    });
};

exports.deleteMovie = (req, res) => {
    const { id } = req.params;

    db.get(`SELECT posterUrl FROM movies WHERE id = ?`, [id], (err, movie) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!movie) return res.status(404).json({ error: 'Movie not found' });

        db.run(`DELETE FROM movies WHERE id = ?`, [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            if (movie.posterUrl) {
                const filePath = path.join(__dirname, '..', movie.posterUrl);
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Failed to delete poster file:', err);
                });
            }

            res.json({ message: 'Movie deleted successfully' });
        });
    });
};
