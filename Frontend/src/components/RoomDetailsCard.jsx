import { FaUser, FaUsers, FaCopy } from 'react-icons/fa';
import { FaHouse } from "react-icons/fa6";

export default function RoomDetailsCard({ roomDetails, onLeaveRoom, onCopyLink, isMobile }) {
  return (
    <div className="flex flex-col h-full gap-3">

      <div className="border flex-1 border-white/10 rounded-2xl p-3 md:p-4 bg-black/40 backdrop-blur text-center flex flex-col justify-between items-center">
        <h3 className={`text-white font-semibold mb-2 md:mb-3 ${isMobile ? 'text-base' : 'text-2xl'}`}>
          Room Details
        </h3>

  
        <div className={`${isMobile ? 'space-y-1' : 'space-y-2'} mb-1 md:mb-2`}>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <FaHouse className={`text-white/50 mt-1 flex-shrink-0  ${isMobile ? 'text-base' : 'text-2xl'}`} />
            <div className="">
              <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-sm'}`}>Room name</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>
                {roomDetails.roomName}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <FaUser className={`text-white/50 mt-1 flex-shrink-0  ${isMobile ? 'text-base' : 'text-2xl'}`} />
            <div className="">
              <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-sm'}`}>Room host</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>
                {roomDetails.createdBy.firstname}
              </p>
            </div>
          </div>


          <div className="flex items-center justify-center gap-3 md:gap-4">
            <FaUsers className={`text-white/50 mt-1 flex-shrink-0  ${isMobile ? 'text-base' : 'text-3xl'}`} />
            <div className="">
              <p className={`text-white/50 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total members</p>
              <p className={`text-white font-medium ${isMobile ? 'text-xs' : 'text-base'}`}>
                {roomDetails.totalMembers}
              </p>
            </div>
          </div>

        </div>


        <button
          onClick={onLeaveRoom}
          className={`w-full bg-transparent border border-white hover:bg-white text-white hover:text-black font-bold rounded-2xl transition-colors duration-200 cursor-pointer ${isMobile ? 'py-1 text-sm' : 'py-1'}`}
        >
          Leave Room
        </button>
      </div>


      <div className="border flex-1 border-white/10 rounded-2xl p-3 md:p-4 bg-black/40 backdrop-blur flex flex-col justify-center gap-8 items-center">
        <div className={`text-center `}>
          <h1 className={`text-white mb-2 ${isMobile ? 'text-base' : 'text-2xl'}`}>Room Code:</h1>
          <p className={`text-white font-black ${isMobile ? 'text-xl' : 'text-2xl'}`}>{roomDetails.roomCode}</p>
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
