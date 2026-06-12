import axios from 'axios'
const SKIP_SOME_PATH = ['/login', '/signup'];
const URL = 'http://localhost/3000';

const api = axios.create({
    url: URL,
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
            return config;
        }

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
                try {
                    const res = await axios.post(
                        `${URL}/api/auth/newAccessToken`,
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