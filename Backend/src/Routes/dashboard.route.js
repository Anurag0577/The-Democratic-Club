import express from 'express'
import { secretInfo } from "../Controllers/dashboard.controller.js";
import { authMiddleware } from '../Middleware/authMiddleware.js';
const router = express.Router();

router.get('/secret', authMiddleware, secretInfo);

export default router;