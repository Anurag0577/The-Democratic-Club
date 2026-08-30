import { useEffect } from "react";
import logo_img from "../assets/Images/the_democratic_club_logo_white.png";
import useAuthStore from "../store/useAuthStore.js";
import heroBanner from "../assets/Images/final-banner-tdc.png";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { TbLogout } from "react-icons/tb";
import AnimatedText from "./DesignComponent/AnimatedText.jsx";
import screenshotOne from "../assets/Images/room-ss-1.png";
import cardOne from "../assets/Images/card-1.jpeg";
import cardTwo from "../assets/Images/card-2.jpeg";
import cardThree from "../assets/Images/card-3.jpeg";
import cardFour from "../assets/Images/card-4.jpeg";
import stepOneImg from "../assets/Images/stepOneImg.png";
import stepTwoImg from "../assets/Images/stepTwoImg.png";
import stepThreeImg from "../assets/Images/stepThreeImage.png";
import stepFourImg from "../assets/Images/stepFourImg.png";
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
            <header className="top-0 left-0 w-full bg-black">
                <nav className="mx-auto flex justify-center items-center">
                    <div className="relative flex items-center gap-4 px-4 md:px-6 py-1.5 flex-wrap justify-between w-full h-18">

                        <div></div>

                        {/* LOGO */}
                        <div
                            onClick={() => navigate("/")}
                            className="absolute cursor-pointer left-6 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pt-4"
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
                    backgroundImage: `url(${heroBanner})`,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col items-center gap-4 md:gap-6 animate-float-slow">

                    <span className="text-[#72FF21] text-xs font-bold tracking-[0.1em] uppercase">
                        The Republic of Sound
                    </span>

                    <h1 className="text-3xl sm:text-4xl md:text-7xl font-medium tracking-tight leading-[1.1] md:leading-[1]">
                        Put Your Music Playback Under{" "}
                        <em className="italic">Democratic</em> Rule.
                    </h1>

                    <p className="text-white/80 text-base md:text-xl max-w-2xl leading-normal space-mono-regular">
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
            <div
                className="h-fit w-full py-12 md:py-20 px-6 md:px-auto text-white flex justify-center border-b border-white/20"
            >

                <AnimatedText
                    text="In every gathering, one person connects their phone and decides what plays, often ignoring what the room actually wants. It’s frustrating and can quickly kill the vibe."
                />
            </div>


            {/* ---------------- INTRODUCE SAAS ---------------- */}
            <div className="w-full py-12 md:py-20 bg-[#080808] text-white border-b border-white/20">

                <div className="heading-container w-full flex flex-col justify-center items-center px-6 md:px-0">

                    <div className="subheading text-sm tracking-tight pb-4">
                        A NEW RULE FOR THE AUX.
                    </div>

                    <h2 className="text-4xl leading-tighter md:text-5xl tracking-tight text-center ">
                        The music isn't controlled by one person anymore.
                    </h2>

                    <h2 className="text-3xl md:text-5xl tracking-tight text-center">
                        It's decided by everyone.
                    </h2>

                    <p className=" text-sm md:text-lg tracking-tight text-white/80 pt-4 pb-8 md:pb-10 text-center space-mono-regular">
                        The Democratic Club brings democratic decision-making to
                        music playback, making the soundtrack of a gathering
                        something everyone can participate in.
                    </p>

                </div>

                <div className="image-screenshot-container px-6 md:px-30">
                    <img
                        src={screenshotOne}
                        className="rounded-xl border-2 border-gray-500"
                        alt="The Democratic Club room"
                    />
                </div>

            </div>


            {/* ---------------- USE CASES ---------------- */}
            <div className="useCases-container bg-white text-black flex flex-col justify-center items-center py-12 md:py-20 border-b border-black/20">

                <div className="useCase-heading-container flex flex-col justify-center items-center pb-8 md:pb-10 px-6 md:px-0">

                    <div className="subheading text-sm tracking-tight pb-2">
                        USE CASES
                    </div>

                    <h2 className="text-4xl leading-tighter md:text-5xl md:tracking-tight text-center">
                        If people are together, the music can be decided together.
                    </h2>

                </div>


                <div
                    className="useCase-card-container w-full flex flex-col md:flex-row justify-around px-5 gap-4 md:gap-8 md:max-w-[90%] text-white"
                    style={{ perspective: "1000px" }}
                >

                    {/* CARD ONE */}
                    <div
                        className="card card-one relative h-48 md:h-80 w-full aspect-square bg-black border-2 border-gray-500 flex-1 rounded-2xl flex justify-center items-end overflow-hidden transition-transform duration-300 ease-out will-change-transform md:hover:[transform:rotateX(6deg)_rotateY(-6deg)_scale(1.03)]"
                        style={{
                            backgroundImage: `url(${cardOne})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />

                        <p className="relative z-10 p-2 text-base md:text-xl text-shadow-2xl">
                            Party at clubs
                        </p>
                    </div>


                    {/* CARD TWO */}
                    <div
                        className="card card-two relative h-48 md:h-80 w-full aspect-square bg-black border-2 border-gray-500 flex-1 rounded-2xl flex justify-center items-end overflow-hidden transition-transform duration-300 ease-out will-change-transform md:hover:[transform:rotateX(6deg)_rotateY(6deg)_scale(1.03)]"
                        style={{
                            backgroundImage: `url(${cardTwo})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />

                        <p className="relative z-10 p-2 text-base md:text-xl text-shadow-2xl">
                            Enjoy With Friends
                        </p>
                    </div>


                    {/* CARD THREE */}
                    <div
                        className="card card-three relative h-48 md:h-80 w-full aspect-square bg-black border-2 border-gray-500 flex-1 rounded-2xl flex justify-center items-end overflow-hidden transition-transform duration-300 ease-out will-change-transform md:hover:[transform:rotateX(-6deg)_rotateY(-6deg)_scale(1.03)]"
                        style={{
                            backgroundImage: `url(${cardThree})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />

                        <p className="relative z-10 p-2 text-base md:text-xl text-shadow-2xl">
                            Festival Gathering
                        </p>
                    </div>


                    {/* CARD FOUR */}
                    <div
                        className="card card-four relative h-48 md:h-80 w-full aspect-square bg-black border-2 border-gray-500 flex-1 rounded-2xl flex justify-center items-end overflow-hidden transition-transform duration-300 ease-out will-change-transform md:hover:[transform:rotateX(-6deg)_rotateY(6deg)_scale(1.03)]"
                        style={{
                            backgroundImage: `url(${cardFour})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            transformStyle: "preserve-3d",
                        }}
                    >
                        <div className="absolute inset-0 bg-black/20 transition-colors duration-300" />

                        <p className="relative z-10 p-2 text-base md:text-xl text-shadow-2xl">
                            Family Event
                        </p>
                    </div>

                </div>

            </div>


            {/* ---------------- HOW TO USE ---------------- */}
            <div className="howToUse bg-white text-black flex flex-col justify-center items-center py-12 md:py-20">

                <div className="howToUse-heading-container flex flex-col justify-center items-center w-full px-6 md:px-0">

                    <div className="subheading text-sm tracking-tight pb-4">
                        NEXT STEP
                    </div>

                    <h2 className="text-4xl leading-tighter md:text-5xl tracking-tight text-center">
                        How It Works?
                    </h2>

                    <p className="text-base md:text-lg tracking-tight text-gray-600 pt-4 pb-8 md:pb-10 text-center space-mono-regular">
                        Set up your music session, bring everyone in, and let the
                        room decide what plays next.
                    </p>

                </div>


                {/* STEP 01 */}
                <div className="step-one flex flex-col md:flex-row-reverse justify-between items-center border-y border-black/30 w-[90%] md:w-[80%]">

                    <div className="step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        01
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5 md:text-right">

                        <h2 className="text-3xl md:text-4xl">
                            Connect Spotify & Create a Room
                        </h2>

                        <p className="text-sm pl-0 pr-0 md:pl-10 text-black/80 space-mono-regular">
                            Link your Spotify Premium account to get started,
                            Premium is required since playback runs through
                            Spotify's official Web Player SDK. Once connected,
                            hit "Create Room" to spin up a new listening session.
                        </p>

                    </div>

                    <img
                        src={stepOneImg}
                        alt="Connect Spotify and create a room"
                        className="order-1 md:order-none border-4 border-gray-300 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-r-6 aspect-video rounded-2xl md:rounded-tr-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>


                {/* STEP 02 */}
                <div className="step-two flex flex-col md:flex-row justify-between items-center border-y border-black/30 w-[90%] md:w-[80%]">

                    <div className="step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        02
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5">

                        <h2 className="text-3xl md:text-4xl">
                            Share the Room Code
                        </h2>

                        <p className="text-sm text-black/80 pl-0 pr-0 md:pr-10 space-mono-regular">
                            Once your room is created, share the unique room code
                            with your friends. They can head to the app, enter
                            the code, and join your room instantly. No Spotify
                            Premium required on their end, just an account to hop in.
                        </p>

                    </div>

                    <img
                        src={stepTwoImg}
                        alt="Share the room code"
                        className="order-1 md:order-none border-4 border-gray-300 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-l-6 aspect-video rounded-2xl md:rounded-tl-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>


                {/* STEP 03 */}
                <div className="step-three flex flex-col md:flex-row-reverse justify-between items-center border-y border-black/30 w-[90%] md:w-[80%]">

                    <div className="step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        03
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5 md:text-right">

                        <h2 className="text-3xl md:text-4xl">
                            Add & Upvote Songs
                        </h2>

                        <p className="text-sm pl-0 pr-0 md:pl-10 text-black/80 space-mono-regular" >
                            Once inside the room, guests can search for and add
                            their favorite tracks straight to the shared queue.
                            Don't want to add your own? Upvote songs already in
                            the queue instead. The more upvotes a track gets,
                            the higher it climbs.
                        </p>

                    </div>

                    <img
                        src={stepThreeImg}
                        alt="Add and upvote songs"
                        className="order-1 md:order-none border-4 border-gray-300 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-r-6 aspect-video rounded-2xl md:rounded-tr-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>


                {/* STEP 04 */}
                <div className="step-four flex flex-col md:flex-row justify-between items-center border-y border-black/30 w-[90%] md:w-[80%]">

                    <div className="step-count order-2 md:order-none text-5xl md:text-8xl w-fit px-5 py-3 md:py-5">
                        04
                    </div>

                    <div className="step-heading order-3 md:order-none flex-1 py-3 md:py-5">

                        <h2 className="text-3xl md:text-4xl">
                            Song With Highest Votes Play Next
                        </h2>

                        <p className="text-sm md:pr-10 pl-0 pr-0 text-black/80 space-mono-regular">
                            The queue isn't just a list, it's a leaderboard. As
                            upvotes come in, tracks automatically reorder themselves,
                            with the most-voted song always sitting at the top ready
                            to play next. Once the current track ends (or the host
                            skips it), the highest-voted song plays automatically.
                        </p>

                    </div>

                    <img
                        src={stepFourImg}
                        alt="Highest voted song plays next"
                        className="order-1 md:order-none border-4 border-gray-300 m-4 md:m-0 md:mt-5 md:border-t-6 md:border-l-6 aspect-video rounded-2xl md:rounded-tl-2xl h-40 md:h-60 w-[calc(100%-2rem)] md:w-auto object-cover"
                    />

                </div>

            </div>


            {/* ---------------- PHILOSOPHY ---------------- */}
            <div className="philosophy-container py-12 md:py-20 bg-[#080808] text-white w-full flex justify-center border-b border-white/30">

                <div className="philosophy-heading-container flex flex-col justify-center items-center w-[90%] md:w-[70%]">

                    <div className="subheading text-sm tracking-tight pb-4">
                        MY CORE PHILOSOPHY
                    </div>

                    <h2 className="text-4xl leading-tighter md:text-5xl tracking-tight text-center">
                        Music In Shared Spaces Should be Chosen by the Group,
                    </h2>

                    <h2 className="text-4xl leading-tighter md:text-5xl tracking-tight text-center">
                        Not Dictated by One Person.
                    </h2>

                    <p className="text-base md:text-lg tracking-tight text-white/80 pt-4 pb-8 md:pb-10 text-center space-mono-regular">
                        It's not about replacing Spotify. It's about adding a
                        layer of group decision-making on top of Spotify's massive
                        music library. The admin provides the speakers and Spotify
                        account. The group provides the taste. Together, they
                        create the VIBE.
                    </p>

                </div>

            </div>


            {/* ---------------- PROBLEMS IT SOLVES ---------------- */}
            <div className="philosophy-container py-12 md:py-20 bg-[#080808] text-white w-full flex flex-col justify-center border-b border-white/30">

                <div className="philosophy-heading-container justify-center items-center text-center w-full mb-8 md:mb-10 px-6 md:px-0">

                    <h2 className="text-4xl leading-tighter md:text-5xl tracking-tight">
                        The Problem It Solves
                    </h2>

                </div>


                <div className="problem-card-container flex flex-col md:flex-row justify-center items-stretch gap-8 md:gap-20 w-full md:w-[70%] mx-auto px-5">

                    {/* PROBLEM 1 */}
                    <div className="problem-card-one flex-1 flex flex-col justify-center items-center border border-white/30 rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-white/60">

                        <div className="subheading text-sm tracking-tight pb-1">
                            THE PARTY DJ PROBLEM
                        </div>

                        <p className="text-base md:text-lg tracking-tight text-white/80 pt-1 text-center space-mono-regular">
                            At parties, gatherings, or shared workspaces, one
                            person typically controls the music. They play what
                            they like, others request songs awkwardly, and someone
                            always hogs the aux cord. Arguments happen. People feel
                            their music taste is ignored. The same person gets stuck
                            managing music all night.
                        </p>

                    </div>


                    {/* PROBLEM 2 */}
                    <div className="problem-card-two flex-1 flex flex-col justify-center items-center border border-white/30 rounded-2xl p-5 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-white/60">

                        <div className="subheading text-sm tracking-tight pb-1">
                            THE SPOTIFY LIMITATIONS
                        </div>

                        <p className="text-base md:text-lg tracking-tight text-white/80 pt-1 text-center space-mono-regular">
                            Spotify is designed for individual listening. There's
                            no built-in way for multiple people to collaboratively
                            build a queue with voting. You can share a playlist,
                            but you can't let a group democratically decide what
                            plays in real-time.
                        </p>

                    </div>

                </div>

            </div>


            {/* ---------------- ENDING SECTION ---------------- */}
            <div className="philosophy-container py-12 md:py-20 bg-[#080808] text-white w-full flex justify-center border-b border-white/30">

                <div className="philosophy-heading-container flex flex-col justify-center items-center w-[90%] md:w-[70%]">

                    <h2 className="text-3xl md:text-8xl tracking-tight text-center mb-8 md:mb-10">
                        Connect Your Spotify Now, Create a Room And ENJOY
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