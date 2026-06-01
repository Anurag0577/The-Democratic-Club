import mongoose from 'mongoose'
import User from './user.model.js'
const roomSchema = mongoose.Schema({
    roomCode: {
        type: String,
        unique: true
    },
    roomName: {
        type: String,
        require: true,
        minLength: [3, 'Room name is too short. Make sure it have more than 2 words.'],
        maxlength: [30, "Room name containing more than 30 letters!"],
        match: [/^[A-Za-z0-9_\s]+$/, 'You can only use letters, numbers and underscore only']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    currentTrack: {
        type: {
            spotifyUri: {
                type: String,
                required: [true, 'Spotify track URI is mandatory for active playback'],
                trim: true,
            },
            title: {
                type: String,
                required: [true, 'Track title is required'],
                trim: true
            },
            artist: {
                type: String,
                required: [true, 'Artist name is required'],
                trim: true
            },
            albumArt: {
                type: String,
                trim: true,
                default: null // Fallback in case a track doesn't have cover graphics
            },
            startedAt: {
                type: Date,
                required: [true, 'Playback start timestamp is required'],
                default: Date.now // Automatically tracks when the song dropped
            }
        },
        default: null // No track is playing when the room is first created
    }
},
{
    timestamps: true 
})