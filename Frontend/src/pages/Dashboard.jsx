import logoImage from '../assets/Images/the_democratic_club_logo_white.png'
export function Dashboard() {
    const userName = 'Anurag'


    return(
        <>
            <div className="dashboard-page h-screen w-full bg-black text-white px-[10%]" >
                <div className="dashboard-container">
                    <div className="dashboard-header-container flex  items-center justify-center h-auto p-5">
                        <div className="dashboard-header flex justify-between items-center w-full border border-gray-600 py-2 px-5 rounded-2xl">
                            <div className="logo-container">
                                <img src={logoImage} className='h-12'></img>
                            </div>
                            <div className='flex justify-between items-center gap-5'>
                                <p>{`Hi, ${userName} `}</p>
                                <button className='py-2 px-4 rounded-xl bg-red-600'>Logout</button>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-body flex-1">
                            <div className="left-container">
                                    <h2>Join Room</h2>
                                    <div className="body-container">
                                        <input placeholder='Enter room code here' className='py-2 px-4 border border-white rounded-xl'></input>
                                    </div>
                            </div>
                            <div className="right-container">

                            </div>
                    </div>
                </div>
            </div>
        </>
    )
}