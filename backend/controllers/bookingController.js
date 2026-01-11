const db = require('../db');

exports.createBooking = (req, res) => {
    const { userId, movieId, tickets } = req.body;

    if (!userId || !movieId || !tickets) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    db.run(`INSERT INTO bookings (userId, movieId, tickets) VALUES (?, ?, ?)`,
        [userId, movieId, tickets],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, message: 'Booking successful' });
        }
    );
};

exports.getAllBookings = (req, res) => {
    const query = `
        SELECT bookings.id, bookings.tickets, bookings.bookingDate, 
               users.username, movies.title 
        FROM bookings
        JOIN users ON bookings.userId = users.id
        JOIN movies ON bookings.movieId = movies.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};
