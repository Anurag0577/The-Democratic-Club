import {create} from 'zustand'
import {jwtDecode} from 'jwt-decode'
import { toast } from 'sonner';

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isSpotifyConnected: false,
    isSpotifyPremium: false,
    activeModel: null,

    initialiseToken: () => {
        const token = localStorage.getItem('accessToken');
        if(token){
            try {
                const decodedToken = jwtDecode(token);
                set({user: decodedToken, isAuthenticated: true})
                localStorage.setItem('isAuthenticated', true)
            } catch (error) {
                console.log('Token invalid: ', error)
                localStorage.removeItem('accessToken')
                set({user: null, isAuthenticated: false})
                localStorage.setItem('isAuthenticated', false)
            }
        } else {
            console.log('Access token unavailable!')
            set({user: null, isAuthenticated: false})
            localStorage.setItem('isAuthenticated', false)
        }
    },

    openLoginModel: () => set({activeModel : 'login'}),
    openSignupModel: () => set({activeModel: 'signup'}),
    openRoomCreationModel: () => set({activeModel: 'roomCreation'}),
    closeModel: () => set({activeModel: null}),

    updateCurrentUserInfo: (token) => {
        localStorage.setItem('accessToken', token)
        const decodedToken = jwtDecode(token);
        set({user: decodedToken, isAuthenticated: true})
        localStorage.setItem('isAuthenticated', true)
    },

    logout:  () => {
        set({isAuthenticated: false, isSpotifyConnected: false, isSpotifyPremium: false});
        localStorage.removeItem('accessToken');
        localStorage.setItem('isAuthenticated', false)
        toast.message("You have been successfully logged out.")
    }

}))

export default useAuthStore;