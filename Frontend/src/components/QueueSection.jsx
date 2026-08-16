import { FaPlus } from 'react-icons/fa';
import { BiSolidUpvote } from 'react-icons/bi';
import { SearchTrack } from './SearchTrack.jsx';
import { useWebSocketStore } from '../store/useWebSocketStore.js';
import { usePlayerStore } from '../store/usePlayerStore.js';
import { UpvoteBtn } from './UpvoteBtn.jsx';

export default function QueueSection({ isMobile }) {
  const queue = useWebSocketStore((state) => state.roomState.queue) || [];
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const isSdkReady = usePlayerStore((state) => state.isSdkReady);
  const sdkPlayer = usePlayerStore((state) => state.sdkPlayer);
  const deviceId = usePlayerStore((state) => state.deviceId);
  const removeSong = useWebSocketStore((state) => state.removeSong)
  const roomCode = useWebSocketStore((state) => state.roomState.roomCode)
  const currentRoomId = useWebSocketStore((state) => state.currentRoomId)
  const songChanged = useWebSocketStore((state) => state.songChanged)

  async function handlePlaySong() {
    if (queue.length === 0) return;
    console.log("THIS IS QUEUE", queue)
    if (sdkPlayer) {
      try {
        console.log('[QueueSection] Unlocking browser audio via activateElement()...');
        await sdkPlayer.activateElement();
        await sdkPlayer.setVolume(0.8);
      } catch (err) {
        console.error('[QueueSection] activateElement or setVolume failed:', err);
      }
    } else {
      console.warn('[QueueSection] sdkPlayer instance is missing from usePlayerStore!');
    }

    console.log('[QueueSection] Active deviceId at click time:', deviceId);


    const nextTrack = queue[0];
    setCurrentSong(nextTrack);

    // now we have to tell the backend that the current song is changed
    songChanged(nextTrack, roomCode)

    useWebSocketStore.setState((state) => ({
      roomState: {
        ...state.roomState,
        queue: state.roomState.queue.slice(1),
      },
    }));

    // we have to send a REMOVE_SONG message to backend.
    removeSong(nextTrack, roomCode, currentRoomId)
  }

  return (
    <div className={`border border-white/10 rounded-2xl bg-black/0 backdrop-blur flex flex-col h-full ${isMobile ? 'p-3' : 'p-6'}`}>
      <div className={isMobile ? 'mb-3' : 'mb-6'}>
        <h3 className={`text-white text-center font-semibold mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-2xl'}`}>
          Queue ({queue.length})
        </h3>
        <SearchTrack />
      </div>

      <div className={`flex-grow overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isMobile ? 'mb-2' : 'mb-6'}`}>
        {queue.length > 0 ? (
          <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
            {queue.map((song, index) => (
              <div
                key={song.track_id || index}
                className="bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2 md:gap-3 group py-1 px-3"
              >
                <img
                  src={song.thumbnail_img || song.media_img}
                  alt={song.track_name || 'Track cover'}
                  className="rounded object-cover flex-shrink-0 w-8 h-8"
                />

                <div className="flex-grow min-w-0">
                  <p className={`text-white font-semibold truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {song.track_name}
                  </p>
                  <div className="flex gap-x-4">
                    <p className="text-white/60 truncate text-xs">
                      {song.artist_name}
                    </p>
                    <p className="text-white/60 truncate text-xs">
                      {msToTime(song.song_dur)}
                    </p>
                  </div>
                </div>
                <UpvoteBtn song={song}/>
                
              </div>
            ))}
          </div>
        ) : (
          <div className="text-white flex flex-col justify-center items-center h-full">
            <h1 className="text-2xl font-bold">Queue is empty.</h1>
            <p className="text-sm text-gray-400">Add a song to let everyone decide what plays next.</p>
          </div>
        )}
      </div>

      <button
        onClick={handlePlaySong}
        disabled={queue.length === 0 || !isSdkReady}
        className={`w-full border border-white text-white hover:bg-white hover:text-black font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white ${isMobile ? 'py-1 text-xs' : 'py-1'}`}
      >
        <FaPlus className={isMobile ? 'text-xs' : 'text-lg'} />
        {isMobile ? 'Play' : 'Play song'}
      </button>
    </div>
  );
}

function msToTime(ms) {
  if (!ms) return '';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}