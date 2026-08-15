import { useEffect, useState } from "react";
import { usePlayerStore } from "../store/usePlayerStore.js"

export function PlaybackTimeline() {
  const playerStateChanged = usePlayerStore(state => state.playerStateChanged);

  const [tickingPosition, setTickingPosition] = useState(0);

  useEffect(() => {
    if (!playerStateChanged) return;

    setTickingPosition(playerStateChanged.position);

    if (playerStateChanged.paused) return;

    const interval = setInterval(() => {
      setTickingPosition((prev) => {
        const next = prev + 1000;
        return next >= playerStateChanged.duration ? playerStateChanged.duration : next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [playerStateChanged]);

  if (!playerStateChanged) return null;

  const durationMs = playerStateChanged.duration;

  return (
    <div className="mb-4 md:mb-6">
      <div className="bg-white/10 h-1 rounded-full overflow-hidden mb-2 md:mb-3">
        <div
          className="bg-white h-full transition-all duration-300"
          style={{
            width: `${durationMs ? (tickingPosition / durationMs) * 100 : 0}%`,
          }}
        ></div>
      </div>
      <div className="flex justify-between text-white/60 text-xs">
        <span>{msToTime(tickingPosition)}</span>
        <span>{msToTime(durationMs)}</span>
      </div>
    </div>
  );
}

function msToTime(ms) {
  if (!ms) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}