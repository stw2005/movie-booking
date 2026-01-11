const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append extension
    }
});

const upload = multer({ storage: storage });

router.get('/', movieController.getAllMovies);
router.post('/', upload.single('poster'), movieController.createMovie);
router.put('/:id', upload.single('poster'), movieController.updateMovie);
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
