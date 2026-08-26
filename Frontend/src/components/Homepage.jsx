import { useEffect } from "react";
import logo_img from '../assets/Images/the_democratic_club_logo_white.png'
import useAuthStore from '../store/useAuthStore.js'
import heroBanner from '../assets/Images/final-banner-tdc.png'
import { useNavigate } from "react-router";
import {toast} from 'sonner'
import { TbLogout } from "react-icons/tb";

export function Homepage() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const initialiseToken = useAuthStore((state) => state.initialiseToken)
    const openLoginModel = useAuthStore(state => state.openLoginModel);
    const openSignupModel = useAuthStore(state => state.openSignupModel);
    const logout = useAuthStore(state => state.logout)
    const navigate = useNavigate()

    useEffect(() => {
        initialiseToken();
    }, [initialiseToken])

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">

            {/* ------------------ HEADER ------------------ */}
            <header className="fixed top-0 left-0 w-full z-50  ">
                <nav className="mx-auto flex justify-center items-center">
                    <div className=" relative flex items-center gap-4 px-6 py-1.5 flex-wrap justify-between w-full h-18 ">
                        <div></div>
                        <div onClick={() => navigate('/')} className='absolute cursor-pointer left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-4' >
                            <img src={logo_img} alt="The Democratic Club logo" className="h-12 lg:h-22" />
                            
                        </div>
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center justify-center mx-5 cursor-pointer text-sm text-white">
                                        {user.firstname ? `Hello, ${user.firstname}` : ''}
                                    </div>
                                    <a 
                                        onClick={logout}
                                        className="bg-red-600 text-black font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2">
                                        <TbLogout/>    
                                        logout
                                    </a>
                                </div>
                            ) : (
                                <ul className="hidden sm:flex items-center gap-1 list-none">
                                    <li>
                                        <button onClick={() => openLoginModel()} className="px-3.5 py-2 text-sm font-medium text-white hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer">
                                            Login
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={openSignupModel} className="bg-[#72FF21] text-black font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2">
                                            Signup
                                        </button>
                                    </li>
                                </ul>
                            )}
                            
                        </div>
                    </div>
                </nav>
            </header>

            {/* ----------------- HERO BANNER --------------------- */}
            <section
                className="relative min-h-screen flex items-center justify-center text-center bg-black"
                // style={{
                //     backgroundImage: `url(${heroBanner})`,
                //     backgroundSize: 'cover',
                //     backgroundPosition: 'center',
                //     backgroundRepeat: 'no-repeat',
                // }}
            >
                
                <div className="absolute inset-0 bg-black/30" />

                <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center gap-6">

                    
                    <span className="text-[#72FF21] text-xs font-bold tracking-[0.1em] uppercase">
                        The Republic of Sound
                    </span>
                    <h1 className="text-5xl md:text-8xl font-medium tracking-tight leading-[1] ">
                        The <em className="font-['Instrument_Serif']  not-italic ">Aux Cord</em> Just Got a{' '}
                        <em className="font-['Instrument_Serif']  underline not-italic">Constitution.</em>
                    </h1>
                    <p className="text-white/80 text-lg md:text-xl max-w-2xl leading-normal">
                        Welcome to the first music queue built by the people, for the people.
                        No more music dictators hijacking the speaker. Just need to share a link, add your
                        favorite tracks, and let democracy settle the playback.
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center mt-2">
                        <a 
                            onClick={() => {
                                    navigate('/dashboard')
                                    if(!isAuthenticated){
                                        openLoginModel();
                                        toast.error('Please log in to continue.')
                                    }
                            }} 
                            className="bg-[#72FF21] text-black font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2">
                            Get Started
                        </a>
                        <a href="#why" className="bg-trasparent text-white border border-white font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2">
                            Why we built this
                        </a>
                    </div>

                </div>
            </section>

        </div>
    );
}