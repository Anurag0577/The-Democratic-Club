import express from 'express'
import {createRoom, joinRoom, deleteRoom, leaveRoom, getRoomDetails} from '../Controllers/room.controller.js'
import {authMiddleware} from '../Middleware/authMiddleware.js'

const router = express.Router();

router.post('/create-room', authMiddleware, createRoom)
router.post('/join-room', joinRoom)
router.post('/delete-room', deleteRoom)
router.post('/leave-room', leaveRoom)
router.post('/room-details', getRoomDetails)

export default router;