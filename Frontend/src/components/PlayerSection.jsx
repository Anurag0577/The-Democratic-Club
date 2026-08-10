import {
  FaPlay,
  FaPause,
  FaRandom,
  FaStepBackward,
  FaStepForward,
} from 'react-icons/fa';
import { usePlayerStore } from '../store/usePlayerStore';
import { useRoomStore } from '../store/useRoomStore';

export default function PlayerSection() {

  // zustand state and actions
  const currentSong = usePlayerStore((state) => state.currentSong)
  const isPlaying = usePlayerStore((state) => state.isPlaying)
  const accentColor = useRoomStore((state) => state.accentColor)

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col relative bg-black">
      {
        (currentSong) ? (
          <>
          <img
        src={currentSong.imageUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-contain object-center"
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(180deg, ${accentColor} 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 1) 100%)`,
        }}
      ></div>

      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      <div className="p-4 md:p-8 flex-grow flex flex-col justify-between overflow-y-auto relative z-10">

        {/* <div className="flex justify-center mb-3 md:mb-6">
          <div className="relative">
            <img
              src={currentSong.imageUrl}
              alt={currentSong.title}
              className="w-32 h-32 md:w-54 md:h-54 lg:w-56 lg:h-56 rounded-lg object-cover shadow-2xl"
            />
            <div className="absolute inset-0 rounded-lg bg-black/10"></div>
          </div>
        </div> */}

        {/* Album Art with vinyl peeking from behind — spins while playing, sleeve stays still */}
        <div className="flex justify-center mb-3 md:mb-6">
          <div className="relative w-32 h-32 md:w-54 md:h-54 lg:w-56 lg:h-56">

            {/* Vinyl disc — positioned behind, offset right so it peeks past the sleeve edge */}
            <div
              className="absolute"
              style={{ left: '50%', top: 0, width: '100%', height: '100%' }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{
                  animation: 'spin-vinyl 5s linear infinite',
                  animationPlayState: isPlaying ? 'running' : 'paused',
                  transformOrigin: '50% 50%',
                  filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.55))',
                }}
              >
                <defs>
                  <radialGradient id="vinylSheen" cx="35%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
                    <stop offset="55%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                  <clipPath id="labelClip">
                    <circle cx="50" cy="50" r="16" />
                  </clipPath>
                </defs>

                {/* Base disc, colored from the extracted accent */}
                <circle cx="50" cy="50" r="48" fill={accentColor} />

                {/* Grooves — crisp concentric rings */}
                {[44, 40, 36, 32, 28, 24, 20.5].map((r) => (
                  <circle
                    key={r}
                    cx="50"
                    cy="50"
                    r={r}
                    fill="none"
                    stroke="rgba(0,0,0,0.22)"
                    strokeWidth="0.5"
                  />
                ))}

                {/* Glossy sheen */}
                <circle cx="50" cy="50" r="48" fill="url(#vinylSheen)" />

                {/* Center label */}
                <circle cx="50" cy="50" r="17" fill="#111" />
                <image
                  href={currentSong.imageUrl}
                  x="34"
                  y="34"
                  width="32"
                  height="32"
                  clipPath="url(#labelClip)"
                  preserveAspectRatio="xMidYMid slice"
                />

                {/* Spindle hole */}
                <circle cx="50" cy="50" r="2.2" fill="#000" />
                <circle cx="50" cy="50" r="2.2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
              </svg>
            </div>

            {/* Album sleeve — stays still, sits in front */}
            <div className="absolute inset-0 rounded-md overflow-hidden shadow-2xl z-10 bg-black">
              <img
                src={currentSong.imageUrl}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>

          <style>{`
            @keyframes spin-vinyl {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div className="text-center mb-3 md:mb-6">
          <h2 className="text-white text-base md:text-2lg lg:text-4xl font-semibold mb-2 md:mb-4 text-shadow-2xl">
            {currentSong.title}
          </h2>
          <p className='text-white text-shadow-2xl'>{currentSong.artist}</p>
        </div>

        <div className="mb-4 md:mb-6">
          <div className="bg-white/10 h-1 rounded-full overflow-hidden mb-2 md:mb-3">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{
                width: `${(currentSong.currentTime / currentSong.totalTime) * 100}%`,
              }}
            ></div>
          </div>
          <div className="flex justify-between text-white/60 text-xs">
            <span>{currentSong.currentTimeFormatted}</span>
            <span>{currentSong.totalTimeFormatted}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 items-center w-full">
          <div></div>
          <div className="flex justify-center">
            <button
              className="bg-white hover:bg-white text-black rounded-full p-3 md:p-4 text-lg md:text-2xl transition-colors duration-200 shadow-lg cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
            </button>
          </div>
          <div className="flex justify-start pl-4 md:pl-8">
            <button
              className="text-white/60 hover:text-white text-base md:text-2xl transition-colors duration-200 cursor-pointer"
              title="Next"
            >
              <FaStepForward />
            </button>
          </div>
        </div>
      </div>
      </>
        ) : (
            <div className='flex flex-col justify-center items-center text-white h-full'>
              <h1 className=' text-4xl '>Nothing Playing</h1>
              <p>This room is waiting for the first song.</p>
            </div>
        )
      }
    </div>

  );
}