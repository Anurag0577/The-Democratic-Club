import mongoose from 'mongoose'
import 'dotenv/config'

async function connectDB() {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`)
        console.log('Database connected successfully!!')
    } catch (err) {
        console.log(`Database connection failed!! Error: ${err}`)
        process.exit(1);
        // this method is not good in real life application we have to retry to stablish db connection.
    }
}

export {connectDB};