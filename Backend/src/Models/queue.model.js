
import mongoose from 'mongoose';

// QUEUE SCHEME --------------------------------------
const queueScheme = mongoose.Schema({
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room', index: true},
    tracks: [{
        type: {
            track_id: {type: String, required: true, uniqued: true},
            album_img: {type: String, required: true},
            album_name: {type: String, required: true},
            album_uri: {type: String, required: true},
            duration_ms: {type:Number, required: true},
            added_by: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            added_at: {type: Date, default: Date.now },
            upvote_count: {type: Number, default: 0 },
            upvoted_by: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
        }
    }]
})

// ADD ANY TRACK IN THE QUEUE --------------------------------------------
queueScheme.methods.addTrack = async function(trackInfo, userId){
    // check if this track is already in the queue or not
    const isAlreadyInTheQueue = this.tracks.some((trackInfo) => this.track_id === trackInfo.track_id )
    if(isAlreadyInTheQueue){
        return {success: false, message: 'Track is already in the queue! You can not add same text more than once.'}
    }

    // add the track in the queue
    this.tracks.push({
            track_id : trackInfo.track_id,
            album_img : trackInfo.album_img,
            album_name : trackInfo.album_name,
            album_uri : trackInfo.album_uri,
            duration_ms : trackInfo.duration_ms,
            added_by : userId,
            upvoted_by: []
    })
}

// UPVOTE ANY SONG --------------------------------------------------------
queueScheme.methods.upvoteSong = async function(userId, trackId){

    // find the track inside a tracks with track_id
    const track = this.tracks.find(t => t.track_id === trackId)
    if(!track){
        return {success: false, message: 'Unfortunatly, track not existed in the queue.' }
    }

    const hasUpvoted = track.upvoted_by.some(id => id.toString() === userId.toString());

    if (hasUpvoted) {
        return { success: false, message: 'You have already upvoted this track!' };
    }

    track.upvoted_by.push(userId) // add user in the upvoted_by
    track.upvote_count =+ 1 // increase the upvote count


    // sort the array based on upvote
    this.tracks.sort((a, b) => b.upvote_count - a.upvote_count); 

    await this.save(); // save the changes

    return {
        success: true,
        message: 'successfully upvoted the song',
        upvote_count: track.upvote_count
    }
}

// REMOVE UPVOTE FROM ANY SONG ------------------------------------------------
queueScheme.methods.removeUpvote = async function(userId, trackId){
    
    //  check track is in the queue or not
    const track = this.tracks.find(t => t.track_id === trackId)
    if(!track) return {success: false, message: 'Track is not in the queue.'}

    // check whether this userId already upvote that track or not
    const isUserUpvote  = track.upvoted_by.some(t => t.upvoted_by === userId)
    if(!isUserUpvote) return {success: false, message: 'You have to first upvote this song then you can remove it.'}


    track.upvoted_by.pull(userId)
    track.upvote_count =- 1

    // sort the array based on upvote
    this.tracks.sort((a, b) => b.upvote_count - a.upvote_count); 

    // save the changes in the db
    await this.save();

    return {
        success: true,
        message: 'You removed upvote successfully.',
        upvote_count : track.upvoted_by
    }
}


// RETURN THE NEXT TRACK TO PLAY -----------------------------------------
queueScheme.methods.nextTrack = async function(){

    // first check whether or not a queue is empty
    if(this.tracks.length === 0){
        return {success: false, message: 'track is empty right now!'}
    }

    const nextTrack = this.tracks[0];
    // may be here i have to remove this first item from the array. But right now i am just skiping it.

    return {success: true, message: 'This is the track that should play next.', nextTrack}

}

// CREATED MODEL FOR QUEUE --------------------------
const Queue = mongoose.model('Queue', queueScheme)

export {Queue};
