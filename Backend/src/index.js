import 'dotenv/config'; // If it is at line one that is good.
import express from 'express'; // import express lib // using ES Modules instead of old commonJS

const app = express() // create express instance
const PORT = process.env.PORT || 3000;
app.use(express.json()); // important for body parsing

app.get('/', (req, res) => {
    res.send('Welcome to the site!!')
})

const server = app.listen(PORT, () => {
    console.log(`Server started! Running on port ${PORT}.`)
})

// check whether the same port is used by any other application
server.on('error', (error) => {
    if(error.message === 'EADDRINUSE'){
        console.log(`Deployment Failed: Port ${PORT} is already occupied by another process.`)
    } else {
        console.log(`System Error during server initialization: ${error.message}`);
    }
})
