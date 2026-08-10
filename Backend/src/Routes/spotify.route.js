
import express from 'express'
import { handleSearch } from '../Controllers/spotify.controller.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();


router.post('/search', authMiddleware, handleSearch)

export default router;