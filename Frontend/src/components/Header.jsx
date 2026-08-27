import logoImage from '../assets/Images/the_democratic_club_logo_white.png'
import useAuthStore from '../store/useAuthStore';
import { useRoomStore } from '../store/useRoomStore'

export default function Header({ userName, onLogout, roomName }) {

    const room = useRoomStore(state => state.room)
    const user = useAuthStore((state) => state.user)

    return (
        <header className="top-0 left-0 w-full z-50   ">
            <nav className="mx-auto flex justify-center items-center">
                <div className=" relative flex items-center flex-wrap justify-between w-full h-12 md:h-18  border border-white/10 rounded-2xl bg-black/0 backdrop-blur text-center my-2 mx-4">
                    <div></div>
                    <div onClick={() => navigate('/')} className='absolute cursor-pointer left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' >
                        <img src={logoImage} alt="The Democratic Club logo" className="h-12 lg:h-19" />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <div className="flex items-center justify-center mx-5 cursor-pointer text-sm text-white">
                                {user?.firstname ? `Hello, ${user?.firstname}` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
