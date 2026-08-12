import express from 'express'
import {spotifyAuthentication, getSpotifyToken, checkSpotifyAuthStatus, getPlaybackToken} from '../Controllers/spotifyAuth.controller.js'
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();


router.get('/login', spotifyAuthentication);
router.get('/callback', getSpotifyToken);
router.get('/status', authMiddleware, checkSpotifyAuthStatus);
router.get('/playback-token', authMiddleware, getPlaybackToken)


export default router;