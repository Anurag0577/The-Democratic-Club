import {create} from 'zustand'
import {jwtDecode} from 'jwt-decode'

const useAuthStore = create((set) => ({
    user: null,
    spotify_access_token: null,
    isAuthenticated: false,
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

    checkSpotifyAuthentication: async(CLIENT_ID) => {
        const spotify_accessToken = localStorage.getItem('spotify_access_token');
        if(spotify_accessToken) {
             return set({spotify_access_token: spotify_accessToken})
        } else {
            // let try to generate accessToken using refreshToken
            const refreshToken = localStorage.getItem('spotify_refresh_token')

            // if refresh token not available, please throw error
            if(!refreshToken) {
                throw new Error(401, "Please login with your spotify account.")
            }

                console.log('Regenerating access token again.')
               // refresh token that has been previously stored
               const url = "https://accounts.spotify.com/api/token";
            
               const payload = {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  },
                  body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                    client_id: CLIENT_ID
                  }),
               }
               const result = await fetch(url, payload);
               const response = await result.json();
               console.log('This is regenerated accessToken', response.access_token)
               if (!result.ok) {
                 if (response.error === 'invalid_grant') {
                   localStorage.removeItem('spotify_access_token');
                   localStorage.removeItem('spotify_refresh_token');
                   window.location.href = '/login';
                   return;
                 }
            
                 throw new Error(`Token refresh failed: ${response.error}`);
               }
            
               localStorage.setItem('spotify_access_token', response.access_token);
               set({spotify_access_token: response.access_token})
               console.log('Spotify access token value updated to', response.access_token)
               if (response.refresh_token) {
                 localStorage.setItem('spotify_refresh_token', response.refresh_token);
               }
        }     
    },

    openLoginModel: () => set({activeModel : 'login'}),
    openSignupModel: () => set({activeModel: 'signup'}),
    openRoomCreationModel: () => set({activeModel: 'roomCreation'}),
    closeModel: () => set({activeModel: null}),


    updateCurrentUserInfo: (token) => {
        // save access token for future use
        localStorage.setItem('accessToken', token)

        // extract the user information from the access token
        const decodedToken = jwtDecode(token);
        set({user: decodedToken, isAuthenticated: true})
        localStorage.setItem('isAuthenticated', true)

    },

    logout:  () => {
        set({isAuthenticated: false});
        localStorage.removeItem('accessToken');
        localStorage.removeItem('spotify_access_token')
        localStorage.removeItem('spotify_refresh_token')
        localStorage.removeItem('code_verifier')
        localStorage.setItem('isAuthenticated', false)
    }

}))

export default useAuthStore;