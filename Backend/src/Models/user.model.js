import mongoose from 'mongoose'
import { passwordHashing, passwordCompare, checkingPasswordStrength } from './../Utiles/passwordManager.js'
import { type } from 'node:os';

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Firstname is missing!'],
      minLength: [3, 'Firstname must be greater than 2 letters.'],
      maxLength: [20, 'Firstname must not exceed 20 letters.'],
      match: [/^[A-Za-z0-9_\s]+$/, 'Only letters, numbers, spaces, and underscores allowed.'],
      trim: true,
    },
    lastname: {
      type: String,
      required: false,
      minLength: [2, 'Lastname must be at least 2 letters.'],
      maxLength: [20, 'Lastname must not exceed 20 letters.'],
      match: [/^[A-Za-z0-9_\s]+$/, 'Only letters, numbers, spaces, and underscores allowed.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email address.'],
      unique: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email.'],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter your password.'],
      minLength: [6, 'Password must contain at least 6 characters.'],
      // Removed maxLength so hashed passwords (60+ chars) can be saved
    },
    refreshToken: {
      type: String,
    },
    spotify_access_token: {
      type: String,
      select: false,
    },
    spotify_refresh_token: {
      type: String,
      select: false,
    },
    spotify_token_expires_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);


// middleware that hashed the password before saving into a database
userSchema.pre('save', async function(){
    if (!this.isModified('password')) return;

    const { isValid, errors } = await checkingPasswordStrength(this.password);
    if (!isValid) {
        throw new Error(`Password validation failed: ${errors.join(', ')}`);
    }

    this.password = await passwordHashing(this.password);
});


// Instance methods : mongoose provide this .methods this means you are saying: 'hey Mongoose, when the document is created '
userSchema.methods.comparePassword = async function(condidatePassword){
    return await passwordCompare(condidatePassword, this.password)
}


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