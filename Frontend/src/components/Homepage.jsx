import { useEffect } from "react";
import logo_img from '../assets/Images/the_democratic_club_logo_white.png'
import useAuthStore from '../store/useAuthStore.js'
import heroBanner from '../assets/Images/final-banner-tdc.png'
import { useNavigate } from "react-router";
import {toast} from 'sonner'

export function Homepage() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const initialiseToken = useAuthStore((state) => state.initialiseToken)
    const openLoginModel = useAuthStore(state => state.openLoginModel);
    const openSignupModel = useAuthStore(state => state.openSignupModel);
    const navigate = useNavigate()

    useEffect(() => {
        initialiseToken();
    }, [initialiseToken])

    return (
        <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">

            {/* ------------------ HEADER ------------------ */}
            <header className="fixed top-0 left-0 w-full z-50 py-4 ">
                <nav className="max-w-[1280px] mx-auto px-8 flex justify-center items-center ">
                    <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-xl px-6 py-1.5 backdrop-blur-md flex-wrap justify-between w-full backdrop-blur-md">
                        <div onClick={() => navigate('/')} className='cursor-pointer'>
                            <img src={logo_img} alt="The Democratic Club logo" className="h-12 lg:h-18" />
                        </div>
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-1">
                                    <div className="h-8 w-8 border border-white/20 rounded-full flex items-center justify-center mx-5 cursor-pointer text-sm text-white">
                                        {user.firstname ? user.firstname[0].toUpperCase() : 'X'}
                                    </div>
                                </div>
                            ) : (
                                <ul className="hidden sm:flex items-center gap-1 list-none">
                                    <li>
                                        <button onClick={() => openLoginModel()} className="px-3.5 py-2 text-sm font-medium text-white hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer">
                                            Login
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={openSignupModel} className="px-3.5 py-2 text-sm font-medium text-white hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer">
                                            Signup
                                        </button>
                                    </li>
                                </ul>
                            )}
                            <a 
                                onClick={() => {
                                    navigate('/dashboard')
                                    if(!isAuthenticated){
                                        openLoginModel();
                                        toast.error('Please log in to continue.')
                                    }
                                }} 
                                className="bg-[#72FF21] text-black font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer">
                                Create a Room
                            </a>
                        </div>
                    </div>
                </nav>
            </header>

            {/* ----------------- HERO BANNER --------------------- */}
            <section
                className="relative min-h-screen flex items-center justify-center text-center"
                style={{
                    backgroundImage: `url(${heroBanner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                }}
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
                            className="bg-[#72FF21] text-black font-semibold text-base px-7 py-3.5 rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all cursor-pointer">
                            Get Started
                        </a>
                        <a href="#why" className="bg-white/10 text-white font-medium text-base px-7 py-3.5 rounded-xl border border-white/10 hover:bg-white/15 transition-all">
                            Why we built this
                        </a>
                    </div>

                </div>
            </section>

        </div>
    );
}