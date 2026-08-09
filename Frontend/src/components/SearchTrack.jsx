import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { useWebSocketStore } from "../store/useWebSocketStore.js";

export function SearchTrack() {

    
    const spotify_access_token = localStorage.getItem("spotify_access_token");
    
    const [searchString, setSearchString] = useState(""); // live input value
    const [submittedQuery, setSubmittedQuery] = useState(""); // value actually searched
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    
    // zustand states and variable
    const roomState = useWebSocketStore(state => state.roomState);
    const currentUserId = useWebSocketStore(state => state.currentUserId)
    const currentRoomId = useWebSocketStore(state => state.currentRoomId)
    const addSong = useWebSocketStore(state => state.addSong)
    
  const containerRef = useRef(null);

  const baseSpotifySearchURL = "https://api.spotify.com/v1/search";

  async function fetchSearchTrack() {
    const params = new URLSearchParams({
      q: `tracks:${submittedQuery}`,
      type: "track",
      limit: 4,
      market: "IN",
      include_external: "audio",
    });

    const res = await fetch(`${baseSpotifySearchURL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${spotify_access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Spotify search failed: ${res.status}`);
    }

    const data = await res.json();
    return data.tracks.items; // array of track objects
  }

  const {
    data: tracks,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["spotify-search", submittedQuery],
    queryFn: fetchSearchTrack,
    enabled: !!spotify_access_token && submittedQuery.trim().length > 1,
    gcTime: 1000 * 60 * 10,
    select: (items) =>
      items.slice(0, 4).map((track) => ({
        artist_name: track.artists?.[0]?.name ?? "Unknown artist",
        thumbnail_img: track.album?.images?.[2]?.url ?? track.album?.images?.[0]?.url,
        song_dur: track.duration_ms,
        track_id: track.id,
        track_name: track.name,
      })),
  });

  function handleSearch() {
    const trimmed = searchString.trim();
    if (trimmed.length > 1) {
      setSubmittedQuery(trimmed);
      setDropdownOpen(true);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
      e.currentTarget.blur();
    }
  }

  function handleAddSong(track){
    if(!track || !addSong || !currentRoomId || !currentUserId || !roomState.roomCode){
      return;
    }
    addSong(track, roomState.roomCode, currentRoomId)
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDropdown = dropdownOpen && submittedQuery.trim().length > 1;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search songs..."
          className="w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-lime-400/50 transition-colors duration-200 py-3 pl-4 pr-11"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (submittedQuery.trim().length > 1) setDropdownOpen(true);
          }}
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={searchString.trim().length < 2}
          className="absolute right-2 p-2 text-white/50 hover:text-lime-400 disabled:opacity-30 disabled:hover:text-white/50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center rounded-md"
          aria-label="Search"
        >
          <span className="material-symbols-outlined text-xl select-none">
            search
          </span>
        </button>
      </div>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-y-auto
                     bg-black border border-white/10 rounded-lg shadow-xl"
        >
          {isLoading || isFetching ? (
            <div className="px-4 py-3 text-sm text-white/50">Searching...</div>
          ) : isError ? (
            <div className="px-4 py-3 text-sm text-red-400">
              Something went wrong. Try again.
            </div>
          ) : tracks && tracks.length > 0 ? (
            <ul>
              {tracks.map((track) => (
                <li
                  key={track.track_id}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={()=> handleAddSong(track)}
                >
                  {track.thumbnail_img && (
                    <img
                      src={track.thumbnail_img}
                      alt={track.track_name}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{track.track_name}</p>
                    <p className="text-xs text-white/50 truncate">{track.artist_name}</p>
                  </div>
                  <span className="ml-auto text-xs text-white/30 flex-shrink-0">
                    {msToTime(track.song_dur)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-white/50">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

function msToTime(ms) {
  if (!ms) return "";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}