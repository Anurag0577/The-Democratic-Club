export default function VinylSpinner({ imageUrl, accentColor, position = 'right' }) {
  const isLeft = position === 'left';
  const peekSign = isLeft ? -1 : 1; // direction the record peeks out from behind the cover
  const coverShift = -peekSign * 9;
  const coverTilt = -peekSign * 6;
  const vinylShift = peekSign * 16;

  return (
    <div className={`flex ${!isLeft ? 'justify-start' : 'justify-end'} justify-center mb-3 md:mb-6`}>
      <div className="relative w-32 h-32 md:w-54 md:h-54 lg:w-56 lg:h-56 vs-float">
        <div className="group relative w-full h-full cursor-pointer">
          {/* ambient glow */}
          <div
            className="absolute inset-0 rounded-full vs-glow"
            style={{ background: `radial-gradient(circle, ${accentColor}55 0%, transparent 70%)` }}
          />

          <div
            className="absolute vs-vinyl-wrap"
            style={{
              ...(isLeft ? { right: '50%' } : { left: '50%' }),
              top: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full vs-record"
              style={{
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

          <div className="absolute inset-0 rounded-md overflow-hidden shadow-2xl z-10 bg-black vs-cover">
            <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10 vs-sheen"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vs-bob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        .vs-float {
          animation: vs-bob 4.4s ease-in-out infinite;
        }

        @keyframes vs-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .vs-record {
          animation: vs-spin 5.2s linear infinite;
          transition: filter 0.4s ease;
          will-change: transform;
        }
        .group:hover .vs-record {
          animation-duration: 1.6s;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.6));
        }

        .vs-vinyl-wrap {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .group:hover .vs-vinyl-wrap {
          transform: translateX(${vinylShift}px);
        }

        @keyframes vs-wobble {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(${coverTilt / 4}deg); }
        }
        .vs-cover {
          animation: vs-wobble 5.5s ease-in-out infinite;
          transform-origin: ${isLeft ? 'right' : 'left'} center;
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.55s ease;
        }
        .group:hover .vs-cover {
          animation-play-state: paused;
          transform: translateX(${coverShift}px) rotate(${coverTilt}deg) scale(1.03);
          box-shadow: 0 22px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06);
        }

        .vs-sheen {
          transition: opacity 0.5s ease;
        }
        .group:hover .vs-sheen {
          opacity: 0.4;
        }

        @keyframes vs-pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.94); }
          50% { opacity: 0.5; transform: scale(1.02); }
        }
        .vs-glow {
          animation: vs-pulse 3.6s ease-in-out infinite;
          filter: blur(14px);
          z-index: 0;
          pointer-events: none;
        }
        .group:hover .vs-glow {
          animation-duration: 1.2s;
          filter: blur(20px);
        }

        @media (prefers-reduced-motion: reduce) {
          .vs-float, .vs-record, .vs-cover, .vs-glow {
            animation: none !important;
          }
          .group:hover .vs-vinyl-wrap,
          .group:hover .vs-cover {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}