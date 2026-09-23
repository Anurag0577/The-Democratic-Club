import { useRoomStore } from "../store/useRoomStore.js"
import { usePlayerStore } from "../store/usePlayerStore.js"

export function PlayerVinyleSpinner() {

    // zustand states and actions
    const isPlaying = usePlayerStore(state => state.isPlaying)
    const currentSong = usePlayerStore(state => state.currentSong)
    const accentColor = useRoomStore(state => state.accentColor)

    return (
        <>
            <div className="flex flex-1 justify-center mb-3 md:mb-6">
                <div className="relative w-[30vw] h-[30vw] md:w-56 md:h-56">

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

                            <circle cx="50" cy="50" r="48" fill={accentColor} />

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

                            <circle cx="50" cy="50" r="48" fill="url(#vinylSheen)" />

                            <circle cx="50" cy="50" r="17" fill="#111" />
                            <image
                                href={currentSong.media_img || currentSong.thumbnail_img}
                                x="34"
                                y="34"
                                width="32"
                                height="32"
                                clipPath="url(#labelClip)"
                                preserveAspectRatio="xMidYMid slice"
                            />

                            <circle cx="50" cy="50" r="2.2" fill="#000" />
                            <circle cx="50" cy="50" r="2.2" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
                        </svg>
                    </div>

                    <div className="absolute inset-0 rounded-md overflow-hidden shadow-2xl z-10 bg-black">
                        <img
                            src={currentSong.media_img || currentSong.thumbnail_img}
                            alt={currentSong.track_name}
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
        </>
    )
}