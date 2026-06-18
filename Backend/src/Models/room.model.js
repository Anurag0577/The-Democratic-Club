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

// generate roomCode (if not already exist) before saving
roomSchema.pre('save', async function() {

    if(this.roomCode) return // check the room already have a roomCode or not

    // function to generate random string
    const generateRandomString  = (length) => {
        const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        const result = ''

        for(i=0; i<=length; i++){
            const randomIndex = Math.floor(Math.random() * characters.length)
            result = result + characters.charAt(randomIndex)
        }

        return result;
    }

    const isUnique = false;
    const generatedRoomCode = '';

    while(!isUnique){
        generatedRoomCode = generateRandomString(6); // generate a 6 digit random string

        // check whether this string is unique or not
        const roomExist = await Room.findOne({roomCode: generatedRoomCode})

        // is same code room not exist, make isUnique true.
        if(!roomExist){
            isUnique = true;
        }
    } 
    this.roomCode = generatedRoomCode;
})


// add new members in the room

roomSchema.methods.addNewMember = async function(userId){
    // check user is already in a room or not
    const isAlreadyInRoom = this.members.some(memberId => memberId.toString() === userId.toString());

    if(isAlreadyInRoom){
        return {
            success: false,
            message: `user ${userId} already is a member of the room.`
        }
    }

    this.member.push(userId)
    await this.save();

    return {success: true, message: `User ${userId} is now the member of the room.`}
}

roomSchema.methods.removeMember = async function(userId){
    // remove the user from the room
    this.members.pull(userId)
    await this.save();

    return {success: true, message: `User ${userId} is successfull removed from the room.`}
}

const Room  = mongoose.model('Room', roomSchema);

export {Room}