import 'dotenv/config'; // If it is at line one that is good.
import express from 'express'; // import express lib // using ES Modules instead of old commonJS
import cors from 'cors';
import {connectDB} from './Database/db.js'
const app = express() // create express instance
const PORT = process.env.PORT || 3000;
app.use(express.json()); // important for body parsing
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['get', 'post', 'put', 'delete'],
    credentials: true
}))

app.get('/', (req, res) => {
    res.json(`Welcome to '🏛️ The Democratic Club' `)
})

// catch all the requests that are comming on the endpoints that does not exist
app.use((req, res) => {
    res.status(404).json('This route is not available.')
})

// First the DB connect then only the server start running
connectDB()
    .then(() => {
        const server = app.listen(PORT, () => {
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

