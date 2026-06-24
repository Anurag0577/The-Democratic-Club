import axios from 'axios'
const SKIP_SOME_PATH = ['/login', '/signup'];
const URL = 'http://127.0.0.1:3000/api';

const api = axios.create({
    baseURL: URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})


// do this before api execution
     api.interceptors.request.use(
    (config) => {

        // skip this process if any url from the SKIP_SOME_PATH found
        if(SKIP_SOME_PATH.some(path => config.url.includes(path))){
            return config
        }

        const accessToken = localStorage.getItem('accessToken');

        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`;
            console.log('request interceptor executed!')
            console.log(config)
            return config;
        }

        return config;

    }, 
    error => Promise.reject(error)
)

// do this after api execution 
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // check any 401 or 403 error occurs or retry is true in for the api
            if((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry){
                originalRequest._retry = true;
                console.log('There is an error so now going to generate new access token from the refresh token')
                try {
                    const res = await axios.post(
                        `${URL}/user/newAccessToken`,
                        {},
                        {withCredentials: true}
                    )

                    const newAccessToken = res.data.data.accessToken;

                    if(newAccessToken){
                        localStorage.setItem('accessToken', newAccessToken)
                        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        console.log('Response interceptor executed! May be new accessToken generated!')
                        return api(originalRequest)
                    } else {
                        throw new Error("No access token in response");
                    }
                } catch (error) {
                     console.error("Token refresh failed:", error);
                    localStorage.removeItem("accessToken");
                }
            }
        }
    )

    export default api;