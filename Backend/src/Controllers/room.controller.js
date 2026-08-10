import { asyncHandler } from "../Utiles/asyncHandler.js";
import { ApiError } from "../Utiles/ErrorHandler.js";
import { Room } from "../Models/room.model.js";
import { Queue } from "../Models/queue.model.js";
import { ApiResponse } from "../Utiles/ApiResponse.js";

// CREATE ROOM -------------------------------------------
const createRoom = asyncHandler( async(req, res) => {
     const roomName = req.body.roomName;
     const userId =  req.user.id;


    // check user already have created any room or not
    const doesUserHaveRoom = await Room.findOne({createdBy: userId})
    if(doesUserHaveRoom) {
        console.log('you already create room')
    }
    if(doesUserHaveRoom) return res.status(409).json(new ApiError(409, 'User already have any room, one user can only create one room. You have to first delete it.'))

    // but first in frontend, I have to check whether the user is premium spotify user or not. If user is premium then only it continue.
    // create new room instance, with the values user provide and set current user as createBy
    const newRoom = await Room.create({
        roomName,
        createdBy: userId
    })

    // now create a new queue instanse that is associated with this room
    const newQueue = await Queue.create({
        room: newRoom._id,
        tracks: []
    })

    res.status(200).json(new ApiResponse(200, `New room named ${roomName} successfully created!`, newRoom))
})

// JOIN ROOM ------------------------------------------
const joinRoom = asyncHandler(async( req, res ) => {
    const roomCode = req.body.roomCode;
    if(!roomCode) return res.status(400).json(new ApiError(400, 'Server did not get any room code.'))

    return res.status(200).json(new ApiResponse(200, 'Room exists! User can join the room using Websocket!'))
}) 

// LEAVE ROOM ---------------------------------------------------
const leaveRoom = asyncHandler(async (req, res) => {
    const {roomCode} = req.body;
    const userId  = req.user.id;
    if (!roomCode) return res.status(400).json(new ApiError(400, 'Server did not get room code.')) 

    if (!userId) return res.status(400).json(new ApiError(400, 'Server did not get userId.')) 

    // first check whether the room exist or not
    const foundRoom = await Room.findOne({roomCode: roomCode})
    if(!foundRoom) return res.status(404).json(new ApiError(404, 'Did not found any room that have same room code.'))

    // check the user exist in the member list of the room or not
    const foundUser = foundRoom.members.includes(userId)
    if(!foundUser) return res.status(409).json(new ApiError(409, 'User did not exist in the member list. So we can not remove it.'))

    // remove the current user from the room member list
    foundRoom.members = foundRoom.members.filter(memberId => memberId.toString() !== userId.toString());

    // 4. Save the updated room document back to the database
    await foundRoom.save();

    return res.status(200).json(new ApiResponse(200, 'User removed successfully from the room.'))
})

// DELETE ROOM --------------------------------------------
const deleteRoom = asyncHandler(async(req, res) => {
    const {roomCode} = req.body;
    const userId  = req.user.id;
    const roomId =  req.user.id;

    // check room esixt or not
    const foundRoom = await Room.findOne({roomCode: roomCode})
    if(!foundRoom) return res.status(400).json(new ApiError(400, 'No room found with this room code!'))
    //  check room createdBy is equal to userId
    const isUserHost = foundRoom.createdBy.toString() === userId.toString();
    if(!isUserHost) return res.status(403).json(new ApiError(403,'Current user is not the host of the room, so he can not delete this room.'))

    //  Delete this room 
    await Queue.deleteOne({room: roomId})
    await Room.deleteOne({ roomCode: roomCode });

    return res.status(200).json(new ApiResponse(200, 'Room successfully deleted!', {deletedRoomCode: roomCode}))
})

// GET ROOM INFORMATION -----------------------------------------------
const getRoomDetails = asyncHandler(async(req, res) => {

    // get room code from the body
    const roomCode =  req.body.roomCode;
    if(!roomCode) return res.status(400).json(new ApiError(400, 'Room code missing!'))
    
    // fetch the room information
    const roomInfo = await Room.findOne({ roomCode })
                               .populate('createdBy', 'firstname') 
                               .lean();
    res.status(200).json(new ApiResponse(200, 'Room information successfully fetched!', roomInfo))
})


export {createRoom, joinRoom, deleteRoom, leaveRoom, getRoomDetails};