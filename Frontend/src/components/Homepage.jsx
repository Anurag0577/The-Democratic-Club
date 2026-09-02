import { useEffect } from "react";
import logo_img from "../assets/Images/the_democratic_club_logo_white.png";
import useAuthStore from "../store/useAuthStore.js";
import heroBannerGif from "../assets/Images/heroBannerGif.gif";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { TbLogout } from "react-icons/tb";
import AnimatedText from "./DesignComponent/AnimatedText.jsx";
import screenshotOne from "../assets/Images/room-ss-1.png";
import stepOneImg from "../assets/Images/stepOneImg.png";
import stepTwoImg from "../assets/Images/stepTwoImg.png";
import stepThreeImg from "../assets/Images/stepThreeImage.png";
import stepFourImg from "../assets/Images/stepFourImg.png";
import problemImg from "../assets/Images/problem-img.png"
import leftHand from "../assets/Images/left-hand.png"
import rightHand from "../assets/Images/right-hand.png"
import VinylSpinner from "../components/DesignComponent/vinylSpinner.jsx"
import useBannerone from "../assets/Images/use-banner-one.jpeg"
import useBannertwo from "../assets/Images/use-banner-two.jpeg"
import useBannerthree from "../assets/Images/use-banner-three.jpeg"
import useBannerfour from "../assets/Images/use-banner-four.jpeg"
import useBannerfive from "../assets/Images/use-banner-five.jpeg"
import freeSectionImg from "../assets/Images/tdc-flow-diagram.png"
import danceOne from "../assets/Images/danceOne.gif"
import danceTwo from "../assets/Images/gojoDance.gif"
import bannerGif from "../assets/Images/BannerGif.gif"
import track_img from '../assets/Images/track_img.png'
import { FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";

export function Homepage() {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const initialiseToken = useAuthStore((state) => state.initialiseToken);
    const openLoginModel = useAuthStore((state) => state.openLoginModel);
    const openSignupModel = useAuthStore((state) => state.openSignupModel);
    const logout = useAuthStore((state) => state.logout);

    const navigate = useNavigate();

    useEffect(() => {
        initialiseToken();
    }, [initialiseToken]);

    return (
        <div className="bg-[#080808] min-h-screen text-white">

            {/* ------------------ HEADER ------------------ */}
            <header className="absolute top-0 left-0 w-full bg-transparent z-50">
                <nav className="mx-auto flex justify-center items-center">
                    <div className="relative flex items-center gap-4 px-4 md:px-6 py-1.5 flex-wrap justify-between w-full h-18">

                        <div></div>

                        {/* LOGO */}
                        <div
                            onClick={() => navigate("/")}
                            className="absolute pl-10 md:pl-0 cursor-pointer left-6 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-4"
                        >
                            <img
                                src={logo_img}
                                alt="The Democratic Club logo"
                                className="h-12 md:h-14 lg:h-22"
                            />
                        </div>

                        {/* AUTH BUTTONS */}
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <div className="flex items-center gap-1">

                                    <div className="hidden sm:flex items-center justify-center mx-5 cursor-pointer text-sm text-white">
                                        {user?.firstname
                                            ? `Hello, ${user.firstname}`
                                            : ""}
                                    </div>

                                    <button
                                        onClick={logout}
                                        className="bg-red-600 text-black font-semibold text-xs md:text-sm px-3 md:px-4 py-1 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2"
                                    >
                                        <TbLogout />
                                        logout
                                    </button>

                                </div>
                            ) : (
                                <ul className="flex items-center gap-2 md:gap-3 list-none">

                                    <li>
                                        <button
                                            onClick={() => openLoginModel()}
                                            className="bg-black/60 text-white border border-gray-700 font-semibold text-xs md:text-sm px-3 md:px-4 py-1 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2"
                                        >
                                            Login
                                        </button>
                                    </li>

                                    <li>
                                        <button
                                            onClick={openSignupModel}
                                            className="bg-white/60 text-black border border-gray-700 font-semibold text-xs md:text-sm px-3 md:px-4 py-1 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2"
                                        >
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
                className="relative py-15 md:py-0 md:min-h-screen flex items-center justify-center text-center bg-black hero-section"
                style={{
                    backgroundImage: `url(${heroBannerGif})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="relative z-10 max-w-[80%] font-bold mx-auto px-6 flex flex-col items-center gap-4 md:gap-6 ">

                    <span className="text-[#72FF21] text-xs font-bold tracking-[0.1em] uppercase">
                        The Republic of Sound
                    </span>

                    <h1 className=" bricolage-grotesque-bold text-3xl sm:text-4xl md:text-7xl font-medium tracking-tight leading-[1.1] md:leading-[1]">
                        Put Your Music 🎸 Playback Under 🗽{" "}
                        <em className="italic"> Democratic</em> Rule.
                    </h1>

                    <p className="text-white/80 text-base md:text-xl max-w-2xl leading-normal ">
                        Everyone adds. Everyone votes. The room decides what plays next.
                    </p>

                    <div className="flex gap-4 flex-wrap justify-center mt-2">

                        <button
                            onClick={() => {
                                if (!isAuthenticated) {
                                    openLoginModel();
                                    toast.error("Please log in to continue.");
                                    return;
                                }

                                navigate("/dashboard");
                            }}
                            className="bg-[#72FF21] text-black font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2"
                        >
                            Get Started
                        </button>

                        <a
                            href="#why"
                            className="bg-transparent text-white border border-white font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center gap-2"
                        >
                            Why we built this
                        </a>

                    </div>

                </div>
            </section>


            {/* ---------------- PROBLEM STATEMENT SECTION ---------------- */}
            <div className="h-fit w-full py-10 md:py-12 bg-[#111111] text-white flex flex-col justify-center items-center border-b border-white/20 ">
                <div className="subheading text-xs md:text-sm text-center tracking-tight pb-4 w-full px-6">
                    PROBLEM WE FACE IN DAILY LIFE
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center w-full gap-8 md:gap-12 px-6 md:px-12 lg:px-20">
                    <VinylSpinner imageUrl="https://i.scdn.co/image/ab67616d0000b2730c65b15f5d4d65ed793c37cb" accentColor="#6C2265" position="right" className="hidden md:block"  />
                    <h2 className="bricolage-grotesque-light w-full md:w-1/2 text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight text-center ">
                        In every gathering, one{' '}
                        <em className="text-[#72FF21]">person</em> connects their phone
                        &amp; <em className="text-[#72FF21]">hijack the music</em>.
                    </h2>
                    <VinylSpinner imageUrl="https://i.scdn.co/image/ab67616d0000b2731111adc2ded1cffe91281507" accentColor="#B5B5B1" position="left" className="hidden md:block"  />
                    {/* <img
                        className="w-[70%] sm:w-[55%] md:w-[30%]"
                        src={problemImg}
                    /> */}
                    {/* <div className="group relative w-[70%] sm:w-[55%] md:w-[30%] max-w-md mx-auto aspect-square flex items-center justify-center">

                        <img
                            src={problemImg}
                            alt="center visual"
                            className="w-[90%] object-cover rounded-xl shadow-lg z-10"
                        />
                        <p className="handwriting-font absolute w-40 text-center top-34 left-4 text-2xl tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            I'll play whatever I like.
                        </p>

                        <p className="handwriting-font absolute w-40 top-14 right-[-20px] text-2xl text-white tracking-widest text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            Ignore everyone songs request
                        </p>

                        <p className="handwriting-font absolute  bottom-[-20px] text-2xl text-white tracking-widest text-right opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            You don't know my next track
                        </p>

                    </div> */}
                </div>
            </div>


            {/* ---------------- INTRODUCE SAAS ---------------- */}
            <div className="w-full py-12 md:py-20 bg-[#111111] text-white border-b border-white/20">

                <div className="flex justify-center items-center">
                    <img src={leftHand} className="w-[20%] object-contain relative z-10 animate-float-slow hidden md:block"></img>
                    <div className="heading-container w-full flex flex-col justify-center items-center px-6 md:px-0">

                        <div className="subheading text-sm tracking-tight text-center pb-4">
                            I CREATED A PLATFORM THAT SOLVE THAT
                        </div>

                        <h2 className="bricolage-grotesque-bold text-2xl leading-tighter md:text-5xl tracking-tight text-center ">
                            Music isn't controlled by one person anymore.
                        </h2>

                        <h2 className=" bricolage-grotesque-bold text-xl md:text-5xl tracking-tight text-center">
                            Now it's decided by everyone.
                        </h2>

                        <p className=" text-sm md:text-lg tracking-tight text-white/80 pt-4 pb-8 md:pb-10 text-center ">
                            The Democratic Club brings democratic decision-making to music playback.
                        </p>

                    </div>
                    <img src={rightHand} className="w-[20%] object-contain relative z-10 animate-float-slow hidden md:block"></img>
                </div>

                <div className="image-screenshot-container px-6 md:px-30">
                    <img
                        src={screenshotOne}
                        className="rounded-xl border-4 border-black"
                        alt="The Democratic Club room"
                    />
                </div>

            </div>


            {/* ---------------- HOW TO USE ---------------- */}
            <div className="howToUse flex flex-col justify-center items-center py-12 md:py-20 bg-white text-black">
                <div className=" relative howToUse-heading-container flex w-full px-6 md:px-0 ">
                    <img src={danceTwo} className="h-30 md:h-60 z-10 absolute left-0  md:left-30 top-[-50px] md:top-[-70px]"/>
                    <div className=" flex flex-col justify-center items-center w-full">
                        <div className="subheading text-sm tracking-tight pb-2">
                            NEXT STEP
                        </div>
                        <h2 className="bricolage-grotesque-bold text-4xl leading-tighter md:text-5xl tracking-tight text-center z-100">
                            How It Works?
                        </h2>
                        <p className="text-base md:text-lg tracking-tight text-black/80 pt-2 pb-8 md:pb-10 text-center ">
                            Set up your music session, bring everyone in, and let the
                            room decide what plays next.
                        </p>
                    </div>
                    <img src={danceOne} className="h-30 md:h-60 z-10 absolute right-0 md:right-30 top-[-40px]"/>
                </div>
                


                {/* STEP 01 */}
                <div className="step-one flex flex-col md:flex-row-reverse justify-between items-center border-b border-black/30 w-[90%] md:w-[80%]">

                    <div className="bricolage-grotesque-light step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        01
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5 md:text-right">

                        <h2 className="bricolage-grotesque-light text-3xl md:text-4xl">
                            Connect Spotify & Create a Room
                        </h2>

                        <p className="text-md pl-0 pr-0 md:pl-10 text-black/80 ">
                            Connect your Spotify Premium account and click Create Room to start your session.
                        </p>

                    </div>

                    <img
                        src={stepOneImg}
                        alt="Connect Spotify and create a room"
                        className="order-1 md:order-none border-2 border-gray-700 m-4 md:m-0 md:mt-5 md:border-t-2 md:border-r-2 aspect-video rounded-2xl md:rounded-tr-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>


                {/* STEP 02 */}
                <div className="step-two flex flex-col md:flex-row justify-between items-center border-b border-black/30 w-[90%] md:w-[80%]">

                    <div className="bricolage-grotesque-light step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        02
                    </div>

                    <div className=" step-heading order-3 md:order-none flex-1 py-3 md:py-5">

                        <h2 className="bricolage-grotesque-light text-3xl md:text-4xl">
                            Share the Room Code
                        </h2>

                        <p className="text-md text-black/80 pl-0 pr-0 md:pr-10 ">
                            Share your room code to let friends join in seconds. Guests don't need Premium to vote.
                        </p>

                    </div>

                    <img
                        src={stepTwoImg}
                        alt="Share the room code"
                        className="order-1 md:order-none border-4 border-gray-700 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-l-6 aspect-video rounded-2xl md:rounded-tl-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>


                {/* STEP 03 */}
                <div className="step-three flex flex-col md:flex-row-reverse justify-between items-center border-b border-black/30 w-[90%] md:w-[80%]">

                    <div className="bricolage-grotesque-light step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        03
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5 md:text-right">

                        <h2 className="bricolage-grotesque-light text-3xl md:text-4xl">
                            Add & Upvote Songs
                        </h2>

                        <p className="text-md pl-0 pr-0 md:pl-10 text-black/80 " >
                            Guests can search and add songs to the queue, or upvote existing ones. The more votes a song gets, the higher it climbs.
                        </p>

                    </div>

                    <img
                        src={stepThreeImg}
                        alt="Add and upvote songs"
                        className="order-1 md:order-none border-4 border-gray-700 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-r-6 aspect-video rounded-2xl md:rounded-tr-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>


                {/* STEP 04 */}
                <div className="step-four flex flex-col md:flex-row justify-between items-center border-b border-black/30 w-[90%] md:w-[80%]">

                    <div className="bricolage-grotesque-light step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        04
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5">

                        <h2 className="bricolage-grotesque-light text-3xl md:text-4xl">
                            Song With Highest Votes Play Next
                        </h2>

                        <p className="text-md md:pr-10 pl-0 pr-0 text-black/80 ">
                            Songs reorder in real time based on votes. When the current track ends, the highest-voted track plays automatically.
                        </p>

                    </div>

                    <img
                        src={stepFourImg}
                        alt="Highest voted song plays next"
                        className="order-1 md:order-none border-4 border-gray-700 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-l-6 aspect-video rounded-2xl md:rounded-tl-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>

            </div>

            {/* ---------------- CARD GRID SECTION ---------------- */}
            <div className="w-full py-12 md:py-16 px-6 md:px-12 lg:px-20 text-white border-b border-white/30">
            <div className="useCase-heading-container flex flex-col md:flex-row justify-center md:justify-between pb-8 md:pb-10 px-6 md:px-0">
                <VinylSpinner imageUrl="https://i.scdn.co/image/ab67616d0000b27384272864294efe15fcc66c4f" accentColor="#D8B162" position="right" className="hidden md:block"  />
                <div className="useCase-heading-container flex flex-col justify-center items-center ">

                    <div className="subheading text-sm tracking-tight pb-2">
                        USE CASES
                    </div>

                    <h2 className="bricolage-grotesque-bold text-4xl leading-tighter md:text-5xl md:tracking-tight text-center">
                        If people are together.
                    </h2>
                    <h2 className="bricolage-grotesque-bold text-4xl leading-tighter md:text-5xl md:tracking-tight text-center">
                        Music should decided together.
                    </h2>
                    <p className=" text-sm md:text-lg tracking-tight text-white/80 pt-4 pb-8 md:pb-10 text-center ">
                        Guests search and upvote their favorite music, putting the playlist in everyone’s hands.
                    </p>

                </div>
                <VinylSpinner imageUrl="https://i.scdn.co/image/ab67616d0000b273563e078ad6506c79c9f3292a" accentColor="#8FBBD3" position="left" />
                            </div>
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 md:gap-8">

                    {/* Card 1 */}
                    <div className="relative w-full sm:w-[45%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden group transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                        <img
                            src={useBannerone}
                            alt="Vote the Vibe"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="bricolage-grotesque-bold text-lg md:text-3xl font-semibold tracking-tight">
                                House Parties & Road Trips
                            </h3>
                            <p className="text-xs md:text-sm text-white/70 mt-1 leading-snug">
                                Everyone in the car or living room adds their favorites, and the group votes on what plays next.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="relative w-full sm:w-[45%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden group transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                        <img
                            src={useBannertwo}
                            alt="Pick the Playlist"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="bricolage-grotesque-bold text-lg md:text-3xl font-semibold tracking-tight">
                                Family & Cousin Gatherings
                            </h3>
                            <p className="text-xs md:text-sm text-white/70 mt-1 leading-snug">
                                Let older relatives queue golden classics while cousins vote up current hits for a balanced family soundtrack.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="relative w-full sm:w-[45%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden group transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                        <img
                            src={useBannerthree}
                            alt="Festival Anthems"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="bricolage-grotesque-bold text-lg md:text-3xl font-semibold tracking-tight">
                                Festivals & Celebrations
                            </h3>
                            <p className="text-xs md:text-sm text-white/70 mt-1 leading-snug">
                                Keep the collective energy high without a dedicated DJ.
                            </p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="relative w-full sm:w-[45%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden group transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                        <img
                            src={useBannerfour}
                            alt="Stream Soundtrack"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="bricolage-grotesque-bold text-lg md:text-3xl font-semibold tracking-tight">
                                Office Breaks & Socials
                            </h3>
                            <p className="text-xs md:text-sm text-white/70 mt-1 leading-snug">
                                Power Friday happy hours, game nights, or shared workspace background music without one person dictating the vibe.
                            </p>
                        </div>
                    </div>

                    {/* Card 5 */}
                    <div className="relative w-full sm:w-[45%] lg:w-[30%] aspect-[4/3] rounded-2xl overflow-hidden group transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/50">
                        <img
                            src={useBannerfive}
                            alt="Crowd-Powered Celebrations"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                        <div className="absolute bottom-0 left-0 w-full p-4 md:p-5 transition-transform duration-500 group-hover:-translate-y-1">
                            <h3 className="bricolage-grotesque-bold text-lg md:text-3xl font-semibold tracking-tight">
                                College Fests & Events
                            </h3>
                            <p className="text-xs md:text-sm text-white/70 mt-1 leading-snug">
                                Turn any hostel common room, fest stall, or afterparty into a live democratic dance floor
                            </p>
                        </div>
                    </div>

                </div>
            </div>


            {/* ---------------- FREE SECTION ---------------- */}
            <div className="philosophy-container py-12 md:py-20 w-full flex justify-center border-b border-white/30">

                <div className="flex flex-col items-center w-[90%] md:w-[85%] lg:w-[80%] gap-8 md:gap-12 lg:gap-16">

                    <div className="philosophy-heading-container flex flex-col justify-center items-center w-full text-center md:text-left">

                        <div className="subheading text-sm tracking-tight pb-4">
                            SPOTIFY VS THE DEMOCRATIC CLUB
                        </div>

                        <h2 className="bricolage-grotesque-bold text-4xl leading-tighter md:text-5xl tracking-tight">
                            Full Spotify. One New Rule.
                        </h2>

                        <p className="text-base md:text-lg text-center tracking-tight text-white/80 pt-4 ">
                            Every song, every playlist, the same quality you already pay for, The Democratic Club doesn't replace Spotify, it adds the one thing missing: a vote before it plays.
                        </p>

                    </div>


                    <div className="w-full flex justify-center">
                        <img
                            src={freeSectionImg}
                            alt="Spotify vs The Democratic Club"
                            className="w-full max-w-md md:max-w-none object-contain"
                        />
                    </div>

                    

                </div>

            </div>


            {/* ---------------- FREE + SPOTIFY POWERED SECTION ---------------- */}
            <div className="w-full py-16 md:py-20 px-6 md:px-12 lg:px-20 text-white flex flex-col items-center text-center border-b border-white/20"
            >
                {/* Subheading */}
                <div className="subheading text-xs md:text-sm tracking-tight text-white/60 pb-4">
                    NO CATCH, NO COST
                </div>

                {/* Heading */}
                <h2 className="bricolage-grotesque-bold text-3xl sm:text-4xl md:text-6xl font-semibold tracking-tight max-w-4xl">
                    Everything's free. <br className="hidden sm:block" />
                    You just need <span className="text-[#72FF21]">Spotify Premium.</span>
                </h2>

                {/* Description */}
                <p className="text-sm md:text-base text-white/60 mt-5 max-w-xl">
                    TDC doesn't cost a thing to use. It runs entirely on your Spotify account — so you get the full library, full quality, and zero compromises.
                </p>

                {/* Characteristics row */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 md:gap-6 mt-12 w-full max-w-4xl">

                    <div className="flex-1 min-w-[220px] border border-white/15 rounded-2xl px-6 py-6 hover:border-[#72FF21]/50 transition-colors duration-300">
                        <div className="text-2xl md:text-3xl font-semibold text-[#72FF21]">320kbps</div>
                        <div className="text-xs md:text-sm text-white/60 mt-2">
                            Full high-quality streaming, same as Spotify Premium.
                        </div>
                    </div>

                    <div className="flex-1 min-w-[220px] border border-white/15 rounded-2xl px-6 py-6 hover:border-[#72FF21]/50 transition-colors duration-300">
                        <div className="text-2xl md:text-3xl font-semibold text-[#72FF21]">100M+</div>
                        <div className="text-xs md:text-sm text-white/60 mt-2">
                            Songs available — the entire Spotify catalog, unlocked.
                        </div>
                    </div>

                    <div className="flex-1 min-w-[220px] border border-white/15 rounded-2xl px-6 py-6 hover:border-[#72FF21]/50 transition-colors duration-300">
                        <div className="text-2xl md:text-3xl font-semibold text-[#72FF21]">All Languages</div>
                        <div className="text-xs md:text-sm text-white/60 mt-2">
                            Every language, every genre — no library limits.
                        </div>
                    </div>

                </div>

            </div>



            {/* ---------------- ENDING SECTION ---------------- */}
            <div 
                className="philosophy-container py-12 md:py-20 bg-white text-white text-shadow-lg w-full flex justify-center border-b border-white/30" 
                style={{
                    backgroundImage: `url(${bannerGif})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >

                <div className="philosophy-heading-container flex flex-col justify-center items-center w-[90%] md:w-[70%]">

                    <h2 className="bricolage-grotesque-bold text-3xl md:text-8xl tracking-tight text-center mb-8 md:mb-10">
                        Connect Your Spotify. <br/>
                        Create a Room And ENJOY.
                    </h2>

                    <button
                        className="bg-[#72FF21] text-black font-semibold text-sm px-6 py-2.5 rounded-xl whitespace-nowrap hover:opacity-85 hover:-translate-y-px transition-all cursor-pointer flex justify-center items-center"

                        onClick={() => {
                            if (!isAuthenticated) {
                                openLoginModel();
                                toast.error("Please log in to continue.");
                                return;
                            }

                            navigate("/dashboard");
                        }}
                    >
                        Create Room Now
                    </button>

                </div>

            </div>


            {/* ---------------- FOOTER ---------------- */}
            <div className="footer py-5 px-6 md:px-15 bg-black text-white flex flex-col sm:flex-row gap-4 sm:gap-0 justify-between items-center">

                <div className="text-gray-400 text-base md:text-xl text-center sm:text-left">
                    Developed By{" "}
                    <a
                        href=""
                        className="text-white font-bolder underline"
                    >
                        Anurag Singh
                    </a>
                </div>

                <div className="flex gap-6 md:gap-10 w-fit justify-around items-center">

                    <a
                        href="https://github.com/Anurag0577"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub className="text-3xl md:text-3xl cursor-pointer" />
                    </a>

                    <a
                        href="https://www.linkedin.com/in/anurag0577/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaLinkedin className="text-3xl md:text-3xl cursor-pointer" />
                    </a>

                    <a
                        href="https://x.com/anurag0577"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaXTwitter className="text-3xl md:text-3xl cursor-pointer" />
                    </a>
                </div>

            </div>

        </div>
    );
}