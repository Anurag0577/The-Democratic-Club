import { BiSolidUpvote } from 'react-icons/bi';
import useAuthStore from '../store/useAuthStore';
import { useWebSocketStore } from '../store/useWebSocketStore';


export function UpvoteBtn({song}) {

    // state and actions
    const user = useAuthStore((state) => state.user)
    const addUpvote = useWebSocketStore((state) => state.addUpvote)
    const removeUpvote = useWebSocketStore((state) => state.removeUpvote)
    const roomId = useWebSocketStore((state) => state.currentRoomId)
    const roomCode = useWebSocketStore((state) => state.roomState.roomCode)

    const isUserUpvote = () => {
        return song.upvote_by?.some((upvoter) => {
            return upvoter === user.id
        })
    }

    // const isUserUpvote = true;

    const handleUpvote = () => {
        if(isUserUpvote()){
            removeUpvote(song.track_id, roomId, roomCode, user.id )
        } else {
            addUpvote(song.track_id, roomId, roomCode, user.id)
        }
    }
    

    return (
        <>
            <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                <BiSolidUpvote
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUpvote();
                    }}
                    className={`cursor-pointer ${isUserUpvote() ? 'text-red-500' : 'text-white/60'}`}
                    size={20}
                />
                <span className="text-white/60 text-xs">{song.upvote_count || 0}</span>
            </div>
        </>
    )
}