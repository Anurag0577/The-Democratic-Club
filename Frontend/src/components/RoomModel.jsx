import { useState, useEffect } from "react";
import useAuthStore from "../store/useAuthStore.js";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios.js";
import { useNavigate } from "react-router";
export function RoomModel(){
    const closeModel = useAuthStore(state => state.closeModel);
    const activeModel = useAuthStore(state => state.activeModel);
    const user = useAuthStore(state => state.user)
    // state variable
    const [roomName, setRoomName] = useState('My Room')
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.firstname) {
            setRoomName(`${user.firstname}'s Room`)
        }
    }, [user])

    // handling new room creation
    const roomCreation = useMutation({
        mutationKey: ['roomCreation'],
        mutationFn: async({roomName}) => {
            const response = await api.post('/room/create-room', {roomName}, {withCredentials: true})
            console.log('this is response of room creation', response)
            return response.data.data;
        },
        onSuccess: (data) => {
            const generatedCode = data?.roomCode || data?.code; 
            if (generatedCode) {
                closeModel(); 
                navigate(`/room/${generatedCode}`);
            } else {
                console.error("Backend succeeded but did not return a roomCode property!", data);
            }
        },
        onError: (error) => {
            console.log('This is the error while creating new room', error)
        } 
    })

    
    if (activeModel !== 'roomCreation') return null

    return(
        <>
            <div className=" fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={closeModel} >
            {(activeModel === 'roomCreation') && (
                <div className= " room-form-container  relative w-full max-w-92 h-100 max-h-98 p-8 rounded-[24px] bg-[rgb(13,13,13)] border border-white/10 text-white shadow-2xl transition-all transform scale-100 flex flex-col justify-between " onClick={(e) => e.stopPropagation()}>
                        <IoMdCloseCircleOutline onClick={closeModel} className="absolute right-5 top-5 text-xl cursor-pointer"  />
                        <div className="room-form-header flex flex-col justify-center items-center">
                            <h3 className="form-heading text-2xl lg:text-3xl font-bold text-center ">Create a Room</h3>
                            <p className="form-description text-center text-sm text-[#b6b6b6]">Give your room a name and start the session. You'll be the host and music plays from your device.</p>
                        </div>
                        <div className="room-form-body flex-1 flex flex-col justify-center items-center gap-4">
                            <input 
                            onChange={e => {
                              e.preventDefault();
                              setRoomName(e.target.value)
                            }} 
                            value={roomName}
                            placeholder="Saturday Chill" 
                            className="py-2 px-3 border-2 border-white text-white bg-transparent outline-none w-[90%] rounded-2xl ">

                            </input>
                            <button 
                                className="py-1 w-[90%] bg-green-600 rounded-2xl border-3 border-transparent hover:border-white cursor-pointer "
                                onClick={() => roomCreation.mutate({roomName})}    
                            >Create</button>
                        </div>
                    </div> 
            )}   
            </div>
        </>
    )
}