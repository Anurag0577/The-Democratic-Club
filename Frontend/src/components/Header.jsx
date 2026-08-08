import logoImage from '../assets/Images/the_democratic_club_logo_white.png'
import useAuthStore from '../store/useAuthStore';
import {useRoomStore} from '../store/useRoomStore'

export default function Header({userName, onLogout, roomName}) {

  const room = useRoomStore(state => state.room)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="dashboard-header-container flex items-center justify-center h-auto py-2 px-4">
                <div className="dashboard-header flex justify-between items-center w-full border border-white/10 px-5 rounded-2xl">
                  <div className="logo-container">
                    <img src={logoImage} className="h-12 lg:h-14 cursor-pointer" />
                  </div>
                  <h1 className='text-white font-bold text-sm lg:text-2xl uppercase'>{room.roomName}</h1>
                  <div className="flex justify-between items-center gap-2 lg:gap-5">
                    <p className='text-white text-sm lg:text-lg'>Hi, {user?.firstname}</p>
                    <button  className="text-white py-1 px-2 text-sm lg:text-lg lg:py-2 lg:px-4 rounded-xl bg-red-600 cursor-pointer" onClick={onLogout}>Logout</button>
                  </div>
                </div>
              </div>
  );
}
