import express from 'express'
import {spotifyAuthentication, getSpotifyToken, checkSpotifyAuthStatus} from '../Controllers/spotifyAuth.controller.js'
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();


router.get('/login', spotifyAuthentication);
router.get('/callback', getSpotifyToken);
router.get('/status', authMiddleware, checkSpotifyAuthStatus);


export default router;