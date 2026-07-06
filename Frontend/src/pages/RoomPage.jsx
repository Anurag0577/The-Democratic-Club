import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Header from '../components/Header.jsx';
import RoomDetailsCard from '../components/RoomDetailsCard.jsx';
import PlayerSection from '../components/PlayerSection.jsx';
import QueueSection from '../components/QueueSection.jsx';
import { useAccentColor } from '../hooks/useAccentColor.js';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios.js';
import useAuthStore from '../store/useAuthStore.js';

const CLIENT_ID = 'e68b2e0ec25345a5a0cc536b33506b84';

export default function RoomPage() {
  const [userName] = useState('Pushpa');
  const [isPlaying, setIsPlaying] = useState(true);
  const { roomCode } = useParams();

    const checkSpotifyAuthentication = useAuthStore(state => state.checkSpotifyAuthentication)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const initialiseToken = useAuthStore(state => state.initialiseToken)
  
    useEffect(() => {
    initialiseToken();
    const isAuthenticatedValue = localStorage.getItem('isAuthenticated') === 'true'
    useAuthStore.setState({isAuthenticated: isAuthenticatedValue })
    checkSpotifyAuthentication(CLIENT_ID);

  }, [checkSpotifyAuthentication, isAuthenticated, initialiseToken])
  // Current Song State with gradient accent
  const [currentSong] = useState({
    title: 'Winning Speech',
    artist: 'Karan Aujla',
    album: 'Four You',
    genre: 'Punjabi',
    year: '2021',
    imageUrl:
      'https://i.scdn.co/image/ab67616d0000b273fe841eef499c6933add94d57',
    requestedBy: 'Armaan Singh',
    requestedByAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop',
    currentTime: 21,
    totalTime: 190,
    currentTimeFormatted: '0:21',
    totalTimeFormatted: '3:10',
  });

  const accentColor = useAccentColor(currentSong.imageUrl);

  // Queue State
  const [queue, setQueue] = useState([
    {
      title: 'Pasoori',
      artists: 'Ali Sethi, Shae Gill',
      duration: '4:10',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop',
      likes: 24,
      isLiked: false,
    },
    {
      title: '295',
      artists: 'Sidhu Moose Wala',
      duration: '3:10',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop',
      likes: 18,
      isLiked: false,
    },
    {
      title: 'Obsessed',
      artists: 'Riar Saab',
      duration: '3:45',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop',
      likes: 16,
      isLiked: false,
    },
    {
      title: 'Husn',
      artists: 'Anuv Jain',
      duration: '3:20',
      imageUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=100&h=100&fit=crop',
      likes: 14,
      isLiked: false,
    },
    {
      title: 'Iktara',
      artists: 'Amit Trivedi, Kavita Seth',
      duration: '2:55',
      imageUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&h=100&fit=crop',
      likes: 12,
      isLiked: false,
    },
  ]);

  // function to fetch room details
  const fetchingRoomDetails = async () => {
    const response = await api.post('/room/room-details', {
      roomCode,
    }, {
      withCredentials: true,
    });
    console.log(response.data.data)
    return response?.data?.data;
  };

  // fetching room details
  const { data: room, isLoading, isError } = useQuery({
    queryKey: ['roomDetails', roomCode],
    queryFn: fetchingRoomDetails,
    enabled: Boolean(roomCode),
  });

  if (!roomCode) {
    return <div>We did not find any room code from the URL.</div>;
  }

  if (isLoading) return <div>Fetching room information...</div>;
  if (isError) return <div>We are getting error</div>;


  // Room Details State
  // const [roomDetailsDemo] = useState({
  //   roomName: `Anurag's Room`,
  //   createdDate: 'May 12, 2024',
  //   hostName: 'Armaan Singh',
  //   totalMembers: 24,
  //   nowPlayingTime: '0:21 / 3:10',
  //   roomCode: '1234',
  //   shareLink: 'thedemocraticclub.com/room/1234',
  // });

  

  // Handlers
  const handleLogout = () => console.log('[v0] Logout clicked');
  const handleLeaveRoom = () => console.log('[v0] Leave room clicked');
  const handleCopyLink = () => console.log('[v0] Copy link clicked');
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handlePrevious = () => console.log('[v0] Previous song clicked');
  const handleNext = () => console.log('[v0] Next song clicked');
  const handleShuffle = () => console.log('[v0] Shuffle clicked');
  const handleRepeat = () => console.log('[v0] Repeat clicked');
  const handleAddSong = () => console.log('[v0] Add song clicked');
  const handleSongClick = (index) => console.log('[v0] Song clicked:', queue[index].title);

  const handleToggleLike = (index) => {
    const newQueue = [...queue];
    newQueue[index].isLiked = !newQueue[index].isLiked;
    newQueue[index].likes += newQueue[index].isLiked ? 1 : -1;
    setQueue(newQueue);
  };





  return (
    <div
    className="h-screen overflow-hidden flex flex-col transition-[background] duration-700"
    style={{
          backgroundImage: `linear-gradient(180deg, ${accentColor}99 0%, rgba(0,0,0,0.95) 90%, #000 100%)`,
          backgroundColor: '#000',
        }}>
      {/* Universal Header */}
      <div className="flex-shrink-0">
        <Header userName={userName} onLogout={handleLogout} roomName={room?.roomName || 'Room'} />
      </div>

      {/* Main Responsive Container */}
      <div className="flex-grow overflow-hidden">
        
        {/* DESKTOP VIEW */}
        <div className="hidden lg:flex h-full gap-4 px-4 pb-4 overflow-hidden">
          {/* Room Details Column */}
          <div className="w-[350px] overflow-hidden">
            <RoomDetailsCard
              roomDetails={room}
              onLeaveRoom={handleLeaveRoom}
              onCopyLink={handleCopyLink}
            />
          </div>

          {/* Main Player Column */}
          <div className=" min-w-[450px] overflow-hidden aspect-square">
            <PlayerSection
              currentSong={currentSong}
              accentColor={accentColor}
              songImageUrl={currentSong.imageUrl}
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onShuffle={handleShuffle}
              onRepeat={handleRepeat}
              isPlaying={isPlaying}
            />
          </div>

          {/* Queue Column (Enforces min width of 84 units / 21rem) */}
          <div className="flex-1 min-w-[21rem] flex-shrink-0 overflow-y-auto">
            <QueueSection
              queue={queue}
              onAddSong={handleAddSong}
              onSongClick={handleSongClick}
              onToggleLike={handleToggleLike}
            />
          </div>
        </div>

        {/* MOBILE VIEW */}
        <div className="lg:hidden flex flex-col h-full overflow-y-auto px-4 pb-6 space-y-4">
          <div className="w-full flex-shrink-0">
            <PlayerSection
              currentSong={currentSong}
              accentColor={accentColor}
              songImageUrl={currentSong.imageUrl}
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onShuffle={handleShuffle}
              onRepeat={handleRepeat}
              isPlaying={isPlaying}
            />
          </div>

          <div className="w-full flex-shrink-0">
            <QueueSection
              queue={queue}
              onAddSong={handleAddSong}
              onSongClick={handleSongClick}
              onToggleLike={handleToggleLike}
              isMobile
            />
          </div>

          <div className="w-full flex-shrink-0">
            <RoomDetailsCard
              roomDetails={room}
              onLeaveRoom={handleLeaveRoom}
              onCopyLink={handleCopyLink}
              isMobile
            />
          </div>
        </div>

      </div>
    </div>
  );
}