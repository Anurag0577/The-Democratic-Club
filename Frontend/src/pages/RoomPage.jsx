import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import Header from '../components/Header.jsx';
import RoomDetailsCard from '../components/RoomDetailsCard.jsx';
import PlayerSection from '../components/PlayerSection.jsx';
import QueueSection from '../components/QueueSection.jsx';
import { useAccentColor } from '../hooks/useAccentColor.js';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import useAuthStore from '../store/useAuthStore.js';
import { useRoomStore } from '../store/useRoomStore.js';
import { websocketService } from '../services/websocketServices.js' // 1. IMPORT WEBSOCKET SERVICE
import { messageType } from '../Utilities/messageType.js';
import { useWebSocketStore } from '../store/useWebSocketStore.js';

const CLIENT_ID = 'e68b2e0ec25345a5a0cc536b33506b84';

export default function RoomPage() {
  const [userName] = useState('Pushpa');
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const user = useAuthStore(state => state.user); // Get current logged in user
  const checkSpotifyAuthentication = useAuthStore(state => state.checkSpotifyAuthentication);
  const initialiseToken = useAuthStore(state => state.initialiseToken);

  // Zustand state variables
  const totalMembers = useRoomStore(state => state.totalMember);
  const setTotalMembers = useRoomStore(state => state.setTotalMember);
  const room = useRoomStore(state => state.room)

  // Grab actions and state from useWebSocketStore
  const joinRoom = useWebSocketStore((state) => state.joinRoom);
  const leaveRoom = useWebSocketStore((state) => state.leaveRoom);
  const roomState = useWebSocketStore((state) => state.roomState);


  // 1. FETCH ROOM DETAILS USING TANSTACK QUERY (POST Request)
  const {
    data: roomData,
    isLoading: isLoadingRoom,
    isError: isRoomError,
  } = useQuery({
    queryKey: ['room-details', roomCode],
    queryFn: async () => {
      const res = await api.post('/room/room-details', { roomCode });
      return res.data?.data || res.data; // Extracts room object
    },
    enabled: !!roomCode, // Only fetch if roomCode exists
  });

  // Extract _id as roomId from fetched details
  const roomId = roomData?._id;
  // Fixed Auth Effect (Removed 'isAuthenticated' from dependencies)
  useEffect(() => {
    initialiseToken();
    const isAuthenticatedValue = localStorage.getItem('isAuthenticated') === 'true';
    useAuthStore.setState({ isAuthenticated: isAuthenticatedValue });
    checkSpotifyAuthentication(CLIENT_ID);
  }, [checkSpotifyAuthentication, initialiseToken]);

  // 2. WEBSOCKET CONNECTION EFFECT
  useEffect(() => {
    const userrId = user?.id;
// Ensure all 3 parameters exist before initiating connection
console.log('RoomCode', roomCode, 'User Id', userrId, 'roomId', roomId)
    if (roomCode && user?.id && roomId) {
      console.log(`Joining room via store: ${roomCode} for user: ${user.id} (roomId: ${roomId})`);

      // Pass roomId (_id from DB), user.id, and roomCode
      joinRoom(roomId, user.id, roomCode);
    } else {
      console.warn('Skipping joinRoom: waiting for roomCode, roomId, or user.id', {
        roomCode,
        roomId,
        userId: user?.id,
      });
    }

    // Cleanup on unmount or when room parameters change
    return () => {
      leaveRoom();
    };
  }, [roomCode, user?.id, joinRoom, leaveRoom, roomId]);

  // Current Song State with gradient accent
  const [currentSong] = useState({
    title: 'Winning Speech',
    artist: 'Karan Aujla',
    album: 'Four You',
    genre: 'Punjabi',
    year: '2021',
    imageUrl: 'https://i.scdn.co/image/ab67616d0000b2736c8802411130056f447257a6',
    requestedBy: 'Armaan Singh',
    requestedByAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop',
    currentTime: 21,
    totalTime: 190,
    currentTimeFormatted: '0:21',
    totalTimeFormatted: '3:10',
  });

  const accentColor = useAccentColor(currentSong.imageUrl);

  // Queue State
  // const [queue, setQueue] = useState([]);

  // Handlers
  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/dashboard');
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/room/${roomCode}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.error('Failed to copy room link:', error);
    }
  };
  const handlePrevious = () => console.log('[v0] Previous song clicked');
  const handleNext = () => console.log('[v0] Next song clicked');
  const handleShuffle = () => console.log('[v0] Shuffle clicked');
  const handleRepeat = () => console.log('[v0] Repeat clicked');
  const handleAddSong = () => console.log('[v0] Add song clicked');
  // const handleSongClick = (index) => console.log('[v0] Song clicked:', queue[index].title);

  // const handleToggleLike = (index) => {
  //   const newQueue = [...queue];
  //   newQueue[index].isLiked = !newQueue[index].isLiked;
  //   newQueue[index].likes += newQueue[index].isLiked ? 1 : -1;
  //   setQueue(newQueue);
  // };

  return (
    <div
      className="h-screen overflow-hidden flex flex-col transition-[background] duration-700"
      style={{
        backgroundImage: `linear-gradient(180deg, ${accentColor}99 0%, rgba(0,0,0,0.95) 90%, #000 100%)`,
        backgroundColor: '#000',
      }}
    >
      {/* Universal Header */}
      <div className="shrink-0">
        <Header />
      </div>

      {/* Main Responsive Container */}
      <div className="grow overflow-hidden">
        {/* DESKTOP VIEW */}
        <div className="hidden lg:flex h-full gap-4 px-4 pb-4 overflow-hidden">
          <div className="w-[350px] overflow-hidden">
            <RoomDetailsCard
              onLeaveRoom={handleLeaveRoom}
              onCopyLink={handleCopyLink}
            />
          </div>

          <div className="min-w-[450px] overflow-hidden aspect-square">
            <PlayerSection
              currentSong={currentSong}
              accentColor={accentColor}
            />
          </div>

          <div className="flex-1 min-w-[21rem] shrink-0 overflow-y-auto">
            <QueueSection/>
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden flex flex-col h-full overflow-y-auto px-4 pb-6 space-y-4">
          <div className="w-full shrink-0">
            <PlayerSection
              currentSong={currentSong}
              accentColor={accentColor}
            />
          </div>

          <div className="w-full shrink-0">
            <QueueSection
              isMobile
            />
          </div>

          <div className="w-full shrink-0">
            <RoomDetailsCard
              isMobile
              onLeaveRoom={handleLeaveRoom}
              onCopyLink={handleCopyLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}