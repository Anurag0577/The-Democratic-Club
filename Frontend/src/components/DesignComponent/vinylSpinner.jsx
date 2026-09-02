export default function VinylSpinner({ imageUrl, accentColor, position = 'right' }) {
  const isLeft = position === 'left';

  return (
    <div className={`flex ${!isLeft ? 'justify-start' : 'justify-end'} justify-center mb-3 md:mb-6 hidden md:block`}>
      <div className="relative w-32 h-32 md:w-54 md:h-54 lg:w-56 lg:h-56">
        <div
          className="absolute"
          style={{
            ...(isLeft ? { right: '50%' } : { left: '50%' }),
            top: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{
              animation: 'spin-vinyl 5s linear infinite',
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
              href={imageUrl}
              x="34"
              y="34"
              width="32"
              height="32"
              clipPath="url(#labelClip)"
              preserveAspectRatio="xMidYMid slice"
            />

            <circle cx="50" cy="50" r="2.2" fill="#000" />
            <circle
              cx="50"
              cy="50"
              r="2.2"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.4"
            />
          </svg>
        </div>

        <div className="absolute inset-0 rounded-md overflow-hidden shadow-2xl z-10 bg-black">
          <img
            src={imageUrl}
            alt="Cover"
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
  );
}
