import 'dotenv/config'; // If it is at line one that is good.
import express from 'express'; // import express lib // using ES Modules instead of old commonJS
import cors from 'cors';
import {connectDB} from './Database/db.js'
import auth from './Routes/auth.route.js'
import room from './Routes/room.route.js'
import dashboard from './Routes/dashboard.route.js'
import { ApiError } from './Utiles/ErrorHandler.js'
import cookieParser from 'cookie-parser'
import http from 'http';
import { initialiseWebSocketServer } from './WebSocketServer/webSocketServer.js';

const app = express() // create express instance
const PORT = process.env.PORT || 3000;
app.use(cookieParser())
app.use(express.json()); // important for body parsing
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))


app.use('/api/info', dashboard )
app.use('/api/user', auth )
app.use('/api/room', room)

// catch all the requests that are comming on the endpoints that does not exist
app.use((req, res) => {
    res.status(404).json('This route is not available.')
})

// Global error handler — maps known errors to proper HTTP responses
app.use((err, req, res, next) => {
    if (!err) return next()

    // jsonwebtoken errors
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'JWT expired' })
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    // Custom ApiError from application
    if (err instanceof ApiError) {
        return res.status(err.statusCode || 500).json({ success: false, message: err.message, data: err.data || null })
    }

    // Fallback — unexpected errors
    console.error(err)
    return res.status(500).json({ success: false, message: 'Internal Server Error' })
})

// First the DB connect then only the server start running
connectDB()
    .then(() => {

        const httpServer = http.createServer(app)

        // passing http server to websocket so they can run on the same port
        initialiseWebSocketServer(httpServer);

        const server = httpServer.listen(PORT, () => {
            console.log(`Server started! Running on port ${PORT}.`)
        })

        // check whether the same port is used by any other application
        server.on('error', (error) => {
            if (error.message === 'EADDRINUSE') {
                console.log(`Deployment Failed: Port ${PORT} is already occupied by another process.`)
            } else {
                console.log(`System Error during server initialization: ${error.message}`)
            }
        })
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error)
    })

