import { FaUser, FaUsers, FaCopy } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import api from '../api/axios.js';
import useAuthStore from '../store/useAuthStore.js';
import { useRoomStore } from '../store/useRoomStore.js';
import { useWebSocketStore } from '../store/useWebSocketStore.js';

export default function RoomDetailsCard({ onLeaveRoom, onCopyLink, isMobile }) {
  const { roomCode } = useParams();

  const user = useAuthStore((state) => state.user);
  const setTotalMember = useRoomStore((state) => state.setTotalMember);

  const roomState = useWebSocketStore((state) => state.roomState)

  const fetchingRoomDetails = async () => {
    const response = await api.post(
      '/room/room-details',
      { roomCode },
      { withCredentials: true }
    );

    return response?.data?.data;
  };

  const { data: room, isSuccess, isLoading, isError } = useQuery({
    queryKey: ['roomDetails', roomCode],
    queryFn: fetchingRoomDetails,
    enabled: Boolean(roomCode),
  });

  const memberCount = roomState.roomCode === roomCode
    ? roomState.members.length
    : (room?.members?.length ?? 0);

  useEffect(() => {
    setTotalMember(memberCount);
  }, [memberCount, setTotalMember]);

  if (!roomCode) {
    return <div>We did not find any room code from the URL.</div>;
  }

  if (isLoading) return <div>Fetching room information...</div>;
  if (isError) return <div>We are getting error</div>;
  if (!room) return <div>Room details not found.</div>;

  const roomHostId = room?.createdBy?._id;
  const isHost = user?.id === roomHostId;

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="border flex-1 border-white/10 rounded-2xl p-3 md:p-4 bg-black/40 backdrop-blur text-center flex flex-col justify-between items-center">
        <h3 className={`text-white font-semibold mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-2xl'}`}>
          Room Details
        </h3>

        <div className={`${isMobile ? 'space-y-1' : 'space-y-2'} mb-1 md:mb-2`}>
          <div className="flex items-center justify-center gap-3 md:gap-4">
            <FaHouse className={`text-white/50 mt-1 shrink-0 ${isMobile ? 'text-base' : 'text-2xl'}`} />
            <div>
              <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-sm'}`}>Room name</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>
                {room.roomName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <FaUser className={`text-white/50 mt-1 shrink-0 ${isMobile ? 'text-base' : 'text-2xl'}`} />
            <div>
              <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-sm'}`}>Room host</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>
                {room.createdBy?.firstname}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <FaUsers className={`text-white/50 mt-1 shrink-0 ${isMobile ? 'text-base' : 'text-2xl'}`} />
            <div>
              <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total members</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>
                {memberCount}
              </p>
            </div>
          </div>
        </div>

        {isHost ? (
          <button
            onClick={onLeaveRoom}
            className={`w-full bg-transparent border border-white hover:bg-white text-white hover:text-black font-bold rounded-2xl transition-colors duration-200 cursor-pointer ${isMobile ? 'py-1 text-sm' : 'py-1'}`}
          >
            Delete Room
          </button>
        ) : (
          <button
            onClick={onLeaveRoom}
            className={`w-full bg-transparent border border-white hover:bg-white text-white hover:text-black font-bold rounded-2xl transition-colors duration-200 cursor-pointer ${isMobile ? 'py-1 text-sm' : 'py-1'}`}
          >
            Leave Room
          </button>
        )}
      </div>

      <div className="border flex-1 border-white/10 rounded-2xl p-3 md:p-4 bg-black/40 backdrop-blur flex flex-col justify-center gap-8 items-center">
        <div className="text-center">
          <h1 className={`text-white mb-2 ${isMobile ? 'text-base' : 'text-2xl'}`}>Room Code:</h1>
          <p className={`text-white font-black ${isMobile ? 'text-xl' : 'text-2xl'}`}>{roomCode}</p>
        </div>

        <button
          onClick={onCopyLink}
          className={`w-full bg-transparent border border-white hover:bg-white text-white hover:text-black flex justify-center items-center gap-3 font-bold rounded-2xl transition-colors duration-200 cursor-pointer ${isMobile ? 'py-1 text-sm' : 'py-1'}`}
        >
          <FaCopy className={isMobile ? 'text-sm' : 'text-lg'} />
          Copy
        </button>
      </div>
    </div>
  );
}
