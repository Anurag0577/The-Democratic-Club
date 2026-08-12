
import express from 'express'
import { handleSearch, getSpotifyProfile, playTrack } from '../Controllers/spotify.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.get('/me', authMiddleware, getSpotifyProfile)
router.post('/search', authMiddleware, handleSearch)
router.put('/play', authMiddleware, playTrack)

export default router;