import { FaPlus } from 'react-icons/fa';
import { BiSolidUpvote } from "react-icons/bi";
import { SearchTrack } from './SearchTrack.jsx';
export default function QueueSection({
  queue,
  onAddSong,
  onSongClick,
  onToggleLike,
  isMobile,
}) {
  return (
    <div className={`border border-white/10 rounded-2xl bg-black/40 backdrop-blur flex flex-col h-full ${isMobile ? 'p-3' : 'p-6'} `}>
      <div className={isMobile ? 'mb-3' : 'mb-6'}>
        <h3 className={`text-white text-center font-semibold mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-2xl'}`}>
          Queue ({queue.length})
        </h3>
        <SearchTrack/>
      </div>

      <div className={`flex-grow overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${isMobile ? 'mb-2' : 'mb-6'}`}>
        {
          (queue.length > 0) ? (
                    <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
                      {queue.map((song, index) => (
                        <div
                          key={index}
                          onClick={() => onSongClick(index)}
                          className={`bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors duration-200 flex items-center gap-2 md:gap-3 group py-1 px-3`}
                        >
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className={`rounded object-cover flex-shrink-0 ${isMobile ? 'w-8 h-8' : 'w-8 h-8'}`}
                          />

                          <div className="flex-grow min-w-0">
                            <p className={`text-white font-semibold truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                              {song.title}
                            </p>
                            <p className={`text-white/60 truncate ${isMobile ? 'text-xs' : 'text-xs'}`}>
                              {song.artists}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 md:gap-3 flex-shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleLike(index);
                              }}
                              className="text-white/60 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                            >
                              <BiSolidUpvote
                                className={song.isLiked ? 'text-red-500' : ''}
                                size={isMobile ? 15 : 20}
                              />
                            </button>
                            <span className={`text-white/60 ${isMobile ? 'text-xs' : 'text-xs'}`}>{song.likes}</span>
                          </div>
                        </div>
                      ))}
                    </div>
          ) : (
            <div className='text-white flex flex-col justify-center items-center h-full'>
              <h1 className='text-2xl'>Queue is empty.</h1>
              <p className='text-sm'>Add song let everyone play for what play next.</p>
            </div>
          )
        }
      </div>

      <button
        onClick={onAddSong}
        className={`w-full border border-white text-white hover:bg-white hover:text-black font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer ${isMobile ? 'py-1 text-xs' : 'py-1'}`}
      >
        <FaPlus className={isMobile ? 'text-xs' : 'text-lg'} />
        {isMobile ? 'Add song' : 'Add a song to queue'}
      </button>
    </div>
  );
}