import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        require: [true, 'Firstname is missing!'],
        minLength: [3, 'The number of letter must be greater than 2.'],
        maxLength: [20, 'The number of letter must not exceed 20.'],
        match: [/^[A-Za-z0-9_\s]+$/, 'Make sure you only uses upper letters, small letters, numbers and underscore, nothing other than that will support.'],
        trim: true
    },
    Lastname: {
        type: String,
        require: false,
        minLength: [2, 'Number of letter must not less than 2'],
        maxLength: [20, 'Number of letters must not greater than 20.'],
        match: [/^[A-Za-z0-9_\s]+$/, 'Make sure you only uses upper letters, small letters, numbers and underscore, nothing other than that will support.'],
        trim: true,
    },
    email: {
        type: email,
        require: [true, 'Please write you email address.'],
        unique: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
        lowercase:  true
    },
    password: {
        type: String,
        require: [true, 'please enter your password.'],
        minLength: [6, 'Password must contain atleast 5 letters.'],
        maxLength: [25, 'Password must not be greater than 25 letters.']
    }
},
{
    timeStamp: true
}
)

/*
FIRST REASON
MongoDB stores data inside "collections." When you pass 'User' to Mongoose, it automatically turns that string into lowercase and pluralizes it to determine the actual collection name inside MongoDB Atlas.

    If you pass 'User', Mongoose looks for (or creates) a collection named users.

    If you pass 'Room', Mongoose creates a collection named rooms.

    If you pass 'AuditLog', Mongoose creates a collection named auditlogs.

    Senior Tip: If you ever want to override this automated pluralization behavior and force Mongoose to use a specific collection name, you can pass it explicitly as a third argument



SECOND REASON
When you are building cross-document relationships in Mongoose, that exact string acts as a unique identifier key.

For example, if you want to link a Room to the specific User who created it, you use that exact string in your reference schema definition:



const roomSchema = new mongoose.Schema({
    roomCode: String,
    host: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // 👈 Mongoose looks for the model registered with this exact string!
    }
});
*/

const User = mongoose.model('User', userSchema, );

export {User};