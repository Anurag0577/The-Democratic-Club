import { useEffect, useState } from 'react';
import logoImage from '../assets/Images/the_democratic_club_logo_white.png';
import useAuthStore from '../store/useAuthStore.js';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';
import api from '../api/axios.js';
import { toast } from 'sonner';

function redirectToSpotify() {
  const token = localStorage.getItem('accessToken'); // wherever you store it
  window.location.href = `http://127.0.0.1:3000/api/auth/login?token=${token}`;
}

export function Dashboard() {
  const storedUser = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isSpotifyConnected = useAuthStore(state => state.isSpotifyConnected);
  const logout = useAuthStore(state => state.logout);
  const openLoginModel = useAuthStore(state => state.openLoginModel);
  const initialiseToken = useAuthStore(state => state.initialiseToken);
  const openRoomCreationModel = useAuthStore(state => state.openRoomCreationModel);
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    initialiseToken();
    const isAuthenticatedValue = localStorage.getItem('isAuthenticated') === 'true';
    useAuthStore.setState({ isAuthenticated: isAuthenticatedValue });

    // surface any OAuth error redirected back from backend (?spotify_error=...)
    const params = new URLSearchParams(window.location.search);
    const spotifyError = params.get('spotify_error');
    if (spotifyError) {
      console.error('[Frontend] Spotify OAuth error:', spotifyError);
      toast.error(`Spotify connection failed: ${spotifyError}`);
      window.history.replaceState({}, '', '/dashboard');
    }

    async function verifySpotifyConnection() {
      try {
        const res = await api.get('/auth/status', { headers: {'Content-Type': 'Application/json'}, withCredentials: true });
        console.log('[Frontend] Spotify connection status:', res.data.connected);
        useAuthStore.setState({ isSpotifyConnected: res.data.connected });
      } catch (err) {
        console.error('[Frontend] Error checking Spotify status:', err);
      }
    }

    verifySpotifyConnection();
  }, [initialiseToken]);

  const checkPremiumStatus = useMutation({
    mutationKey: ['check_premium'],
    mutationFn: async () => {
      const res = await api.get('/spotify/me', { withCredentials: true });
      return res?.data;
    },
    onSuccess: (data) => {
      console.log('[Frontend] Spotify profile:', data);
      if (data.product === 'premium') {
        toast.success(`Welcome ${data.display_name}! Spotify Premium detected.`);
      } else {
        toast.info(`Spotify account detected (${data.product} plan).`);
      }
    },
    onError: (error) => {
      console.error('[Frontend] Failed to fetch Spotify profile:', error);
      toast.error('Could not verify Spotify premium status.');
    },
  });

  const joiningRoom = useMutation({
    mutationKey: ['join_room'],
    mutationFn: async ({ roomCode }) => {
      const res = await api.post('/room/join-room', { roomCode }, { withCredentials: true });
      return res?.data?.data;
    },
    onSuccess: () => {
      toast.success('You successfully joined the room.');
      navigate(`/room/${roomCode}`);
    },
    onError: (error) => {
      toast.error(`Error joining room: ${error.message || error}`);
      console.error('[Frontend] Error joining room:', error);
    },
  });

  return (
    <>
      {isAuthenticated ? (
        <div className="dashboard-page h-auto lg:h-screen w-full bg-black text-white px-[10%]">
          <div className="dashboard-container flex flex-col justify-center">
            <div className="dashboard-header-container flex items-center justify-center h-auto py-5">
              <div className="dashboard-header flex justify-between items-center w-full border border-gray-600 py-2 px-5 rounded-2xl">
                <div className="logo-container">
                  <img onClick={() => navigate('/')} src={logoImage} className="h-12 lg:h-18 cursor-pointer" alt="Logo" />
                </div>
                <div className="flex justify-between items-center gap-5">
                  <p>{`Hi, ${storedUser?.firstname || 'User'}`}</p>
                  <button onClick={logout} className="py-2 px-4 rounded-xl bg-red-600 cursor-pointer">Logout</button>
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-center mt-10 mb-5">Room Dashboard</h1>

            <div className="dashboard-body flex-1 w-full flex flex-col lg:flex-row justify-between items-center gap-5 mb-10">

              <div className="left-container w-full lg:w-[49%] h-70 max-h-100 bg-[#c6ff33] text-black p-5 flex flex-col justify-between items-center rounded-2xl">
                <div className="h-fit">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">Join a Room</h2>
                  <p className="text-center">Enter the room code shared by your host</p>
                </div>
                <div className="body-container flex-1 flex flex-col lg:flex-row justify-center items-center gap-2">
                  <input
                    placeholder="Enter room code here"
                    className="py-2 px-4 border-black border-2 rounded-xl text-black"
                    onChange={e => setRoomCode(e.target.value)}
                    value={roomCode}
                  />
                  <button
                    className="py-2 px-4 bg-black text-white rounded-xl cursor-pointer w-full lg:w-auto border-3 border-transparent hover:border-white transition-colors"
                    onClick={() => joiningRoom.mutate({ roomCode })}
                  >
                    Join
                  </button>
                </div>
              </div>

              <div className="right-container w-full lg:w-[49%] h-70 max-h-100 bg-[#7d39eb] text-white p-5 flex flex-col justify-between items-center rounded-2xl">
                <div className="h-fit">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center">Host a Room</h2>
                  <p className="text-center">Start a listening session and invite others to join</p>
                </div>
                <div className="body-container flex-1 flex flex-col justify-center items-center gap-2">
                  {isSpotifyConnected ? (
                    <>
                      <p className="text-white text-[12px] bg-green-600 px-4 py-1 rounded-md border border-green-400">✓ SPOTIFY CONNECTED!</p>
                      <button
                        className="py-2 px-4 w-fit lg:w-70 bg-white text-black border-3 border-transparent rounded-xl cursor-pointer font-bold flex justify-center items-center gap-2 hover:border-black transition-colors"
                        onClick={openRoomCreationModel}
                      >
                        Create Room
                      </button>
                      <button
                        onClick={() => checkPremiumStatus.mutate()}
                        disabled={checkPremiumStatus.isPending}
                        className="py-2 px-4 bg-black text-white rounded-xl cursor-pointer text-xs disabled:opacity-50"
                      >
                        {checkPremiumStatus.isPending ? 'Checking...' : 'Check Premium Status'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={redirectToSpotify}
                      className="py-2 px-4 bg-white text-black rounded-xl cursor-pointer font-bold flex justify-center items-center gap-2 border-3 border-transparent hover:border-black transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" height={20} width={20}>
                        <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
                      </svg>
                      Connect with your Spotify
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen w-full bg-black text-white flex flex-col justify-center items-center">
          <h1 className="text-6xl text-center mb-5">Sorry, You need to login to access this page.</h1>
          <button
            className="py-2 px-6 bg-[#72FF21] text-black rounded-2xl border-2 border-transparent hover:border-white ease-out cursor-pointer"
            onClick={openLoginModel}
          >
            Login to your Account
          </button>
        </div>
      )}
    </>
  );
}