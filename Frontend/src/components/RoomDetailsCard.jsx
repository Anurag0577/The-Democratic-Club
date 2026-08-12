import { FaUser, FaUsers, FaCopy } from 'react-icons/fa';
import { FaHouse } from 'react-icons/fa6';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import api from '../api/axios.js';
import useAuthStore from '../store/useAuthStore.js';
import { useRoomStore } from '../store/useRoomStore.js';
import { useWebSocketStore } from '../store/useWebSocketStore.js';

export default function RoomDetailsCard() {
  const { roomCode } = useParams();

  const user = useAuthStore((state) => state.user);
  const setTotalMember = useRoomStore((state) => state.setTotalMember);

  const roomState = useWebSocketStore((state) => state.roomState);

  const fetchingRoomDetails = async () => {
    const response = await api.post(
      "/room/room-details",
      { roomCode },
      { withCredentials: true }
    );

    return response?.data?.data;
  };

  const {
    data: room,
    isSuccess,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["roomDetails", roomCode],
    queryFn: fetchingRoomDetails,
    enabled: Boolean(roomCode),
  });

  const memberCount =
    roomState.roomCode === roomCode
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

      {/* ROOM DETAILS */}
      <div
        className="
          border flex-1 border-white/10 rounded-2xl
          p-3 md:p-4
          bg-black/0 backdrop-blur
          text-center flex flex-col
          justify-between items-center
        "
      >
        <h3 className="text-white font-semibold mb-2 md:mb-3 text-base lg:text-2xl">
          Room Details
        </h3>

        {/* 
          MOBILE:
          3 items in one row

          DESKTOP:
          Your original vertical layout
        */}
        <div
          className="
            w-full
            grid grid-cols-3
            md:flex md:flex-col
            md:space-y-1 lg:space-y-2
            mb-1 md:mb-2
          "
        >

          {/* ROOM NAME */}
          <div className="flex items-center justify-center gap-1.5 md:gap-3 lg:gap-4">
            <FaHouse
              className="
                text-white/50
                mt-0 md:mt-1
                shrink-0
                text-sm md:text-base lg:text-2xl
              "
            />

            <div className="min-w-0">
              <p className="text-white/50 text-[9px] md:text-xs lg:text-sm">
                Room name
              </p>

              <p className="text-white font-medium text-[10px] md:text-xs lg:text-base truncate max-w-[70px] md:max-w-none">
                {room.roomName}
              </p>
            </div>
          </div>

          {/* HOST */}
          <div className="flex items-center justify-center gap-1.5 md:gap-3 lg:gap-4">
            <FaUser
              className="
                text-white/50
                mt-0 md:mt-1
                shrink-0
                text-sm md:text-base lg:text-2xl
              "
            />

            <div className="min-w-0">
              <p className="text-white/50 text-[9px] md:text-xs lg:text-sm">
                Room host
              </p>

              <p className="text-white font-medium text-[10px] md:text-xs lg:text-base truncate max-w-[70px] md:max-w-none">
                {room.createdBy?.firstname}
              </p>
            </div>
          </div>

          {/* MEMBERS */}
          <div className="flex items-center justify-center gap-1.5 md:gap-3 lg:gap-4">
            <FaUsers
              className="
                text-white/50
                mt-0 md:mt-1
                shrink-0
                text-sm md:text-base lg:text-2xl
              "
            />

            <div>
              <p className="text-white/50 text-[9px] md:text-xs lg:text-sm">
                Total members
              </p>

              <p className="text-white font-medium text-[10px] md:text-xs lg:text-base">
                {memberCount}
              </p>
            </div>
          </div>

        </div>

        {/* DELETE / LEAVE */}
        <button
          className="
            w-full
            bg-transparent
            border border-white
            hover:bg-white
            text-white hover:text-black
            font-bold
            rounded-2xl
            transition-colors duration-200
            cursor-pointer
            py-1
            text-xs md:text-sm lg:text-sm
          "
        >
          {isHost ? "Delete Room" : "Leave Room"}
        </button>
      </div>


      {/* ROOM CODE */}
      <div
        className="
          border flex-1 border-white/10 rounded-2xl
          p-3 md:p-4
          bg-black/0 backdrop-blur
          flex md:flex-col md:gap-8
          items-center
          md:items-center justify-around
        "
      >
        
          <h1 className="text-white mb-0 md:mb-2 text-sm md:text-base lg:text-2xl">
            Room Code:
          </h1>
              <p className="text-white font-black text-lg md:text-xl lg:text-4xl">
                {roomCode}
              </p>
            <button
              className="
              min-w-25
                md:w-full
                bg-transparent
                border border-white
                hover:bg-white
                text-white hover:text-black
                flex justify-center items-center
                gap-2 md:gap-3
                font-bold
                rounded-2xl
                transition-colors duration-200
                cursor-pointer
                py-1
                text-xs md:text-sm lg:text-sm
              "
            >
              <FaCopy className="text-xs md:text-sm lg:text-lg" />
              Copy
            </button>
      </div>

    </div>
  );
}