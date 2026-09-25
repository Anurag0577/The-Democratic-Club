import {
  FaPlay,
  FaPause,
} from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../store/usePlayerStore';
import { useSpotifyPlayer } from "../hooks/useSpotifyPlayer.js"
import api from '../api/axios.js';
import track_img from '../assets/Images/track_img.png'
import { useWebSocketStore } from '../store/useWebSocketStore.js';
import { PlaybackTimeline } from './PlaybackTimeline.jsx';
import useAuthStore from '../store/useAuthStore.js'
import { useRoomStore } from '../store/useRoomStore.js';
import { toast } from 'sonner';
import { PlaybackToggle } from './PlaybackToggle.jsx';
import { NextBtn } from './NextBtn.jsx';
import { PlayerVinyleSpinner } from './PlayerVinyleSpinner.jsx';
import StartPlayingSongBtn from './StartPlayingSongBtn.jsx';
import { useAutoAdvance } from '../hooks/useAutoAdvance.js';

export default function PlayerSection() {

  // zustand states and actions
  const currentSong = usePlayerStore(state => state.currentSong);
  const createdBy = useRoomStore((state) => state.room?.createdBy)
  const user = useAuthStore((state) => state.user);
  const spotifyPlayer = usePlayerStore(state => state.spotifyPlayer)
  const device = usePlayerStore(state => state.device)
  const isPlayerReady = usePlayerStore(state => state.isPlayerReady)

  // variable from hooks
  const accentColor = useRoomStore(state => state.accentColor)

  useAutoAdvance();

  useEffect(() => {
    
    if(!currentSong){
      console.log('Current song missing in PlayerSection.')
      return;
    }

    console.log('isPlayerReady:', isPlayerReady, 'spotifyPlayer:', spotifyPlayer, 'device:', device)

    if(!isPlayerReady || !spotifyPlayer || !device){
      console.log('Either isPlayerReady or spotifyPlayer or device is missing!')
      toast.message('Either isPlayerReady or spotifyPlayer or device is missing!')
      return;
    }

    const spotifyUri = currentSong.spotifyUri;

    if (!spotifyUri) {
      console.log('The selected song has no valid Spotify URI/track ID.', currentSong);
      toast.message('The selected song has no valid Spotify URI/track ID.')
      return;
    }

    async function startPlayback() {
        const resp = await api.put(
          '/spotify/play',
          { device, spotifyUri },
          { withCredentials: true }
        );
    }

    startPlayback();

    


  }, [currentSong, device, spotifyPlayer, isPlayerReady])

  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden h-full flex flex-col relative bg-black/0">

      {
        (currentSong) ? (
          <>
          <img
        src={currentSong?.media_img || currentSong?.thumbnail_img}
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
        
        {/* THIS IS THAT RONDING DIV */}
        <PlayerVinyleSpinner/>

        <div className="text-center mb-3 md:mb-6">
          <h2 className="text-white text-base md:text-2lg lg:text-4xl font-semibold mb-2 md:mb-4 text-shadow-2xl">
            {currentSong.track_name}
          </h2>
          <p className='text-white text-shadow-2xl'>{currentSong.artist_name}</p>
        </div>
        
        <div>
          {/* THIS IS TIMELINE COMPONENT ALREADY SEPERATE */}
          <PlaybackTimeline/>
          {createdBy?._id === user?.id ? (
                <div className="grid grid-cols-3 items-center w-full">
                    <div></div>
                    <PlaybackToggle/>
                    <NextBtn/>
                </div>
            ) : (
                <div></div>
            )}
        </div>



      </div>
      </>
        ) : (
            <div className='flex flex-col justify-center items-center text-white h-full min-h-120'>
              <div className="perspective-[1000px]">
                <img
                  src={track_img}
                  className="h-45 lg:h-65 transform-3d rotate-x-6 hover:rotate-y-22 hover:-rotate-x-6 transition-transform duration-300"
                />
              </div>
              <h1 className=' text-4xl '>Nothing Playing!</h1>
              <p className='text-sm text-gray-400 mb-3'>You have to add tracks in a Queue to play music.</p>
              {isPlayerReady ? (
                <p className="text-white px-5 rounded-xl bg-green-700">Player ready! You can play music.</p>
              ) : (
                <p className="text-white px-5 animate-pulse rounded-xl bg-red-600">
                  Wait, getting your player ready...
                </p>
              )}
              <StartPlayingSongBtn/>
            </div>
        )
      }
    </div>

  );
}