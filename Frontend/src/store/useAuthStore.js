import {create} from 'zustand'
import {jwtDecode} from 'jwt-decode'

const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    activeModel: null,
    initialiseToken: () => {
        const token = localStorage.getItem('accessToken');
        if(token){
            try {
                const decodedToken = jwtDecode(token);
                set({user: decodedToken, isAuthenticated: true})
            } catch (error) {
                console.log('Token invalid: ', error)
                localStorage.removeItem('accessToken')
                set({user: null, isAuthenticated: false})
            }
        } else {
            console.log('Token unavailable: ')
            set({user: null, isAuthenticated: false})
        }
    },

    openLoginModel: () => set({activeModel : 'login'}),
    openSignupModel: () => set({activeModel: 'signup'}),
    closeModel: () => set({activeModel: null}),


    updateCurrentUserInfo: (token) => {
        // save access token for future use
        localStorage.setItem('accessToken', token)

        // extract the user information from the access token
        const decodedToken = jwtDecode(token);
        set({user: decodedToken, isAuthenticated: true})

    }
}))

export default useAuthStore;