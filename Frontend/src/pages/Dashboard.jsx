import { useEffect, useState } from 'react'
import logoImage from '../assets/Images/the_democratic_club_logo_white.png'

const CLIENT_ID = 'e68b2e0ec25345a5a0cc536b33506b84';
const REDIRECT_URI = 'http://127.0.0.1:5173/dashboard'
const SCOPE = 'user-read-private user-read-email'

const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = async (plain) => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const redirectToSpotify = async () => {
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)

  localStorage.setItem('code_verifier', codeVerifier)

  const authUrl = new URL('https://accounts.spotify.com/authorize')
  authUrl.search = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPE,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: REDIRECT_URI,
  }).toString()

  window.location.href = authUrl.toString()
}

const getToken = async (code) => {
  const codeVerifier = localStorage.getItem('code_verifier')

  const body = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  })

  const response = await body.json()
  localStorage.setItem('access_token', response.access_token)


  window.history.replaceState({}, '', '/')

  return response.access_token
}

// getting user profile
async function getProfile() {
  let accessToken = localStorage.getItem('access_token');

  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  });

  const data = await response.json();
}


export function Dashboard() {
  const [accessToken, setAccessToken] = useState(null)
  const userName = 'Anurag'

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {

      getToken(code).then(token => setAccessToken(token))
    }

    console.log('accessToken is this', accessToken)
  }, [])

  return (
    <>
      <div className="dashboard-page h-auto lg:h-screen w-full bg-black text-white px-[10%]">
        <div className="dashboard-container flex flex-col justify-center">
          <div className="dashboard-header-container flex items-center justify-center h-auto py-5">
            <div className="dashboard-header flex justify-between items-center w-full border border-gray-600 py-2 px-5 rounded-2xl">
              <div className="logo-container">
                <img src={logoImage} className="h-12" />
              </div>
              <div className="flex justify-between items-center gap-5">
                <p>{`Hi, ${userName}`}</p>
                <button className="py-2 px-4 rounded-xl bg-red-600">Logout</button>
              </div>
            </div>
          </div>

          <div className="text-2xl font-bold text-center mt-10 mb-5">Dashboard</div>

          <div className="dashboard-body flex-1 w-full flex flex-col lg:flex-row justify-between items-center gap-5">
            <div className="left-container w-[95%] lg:w-[48%] h-70 max-h-100 border border-gray-600 p-5 flex flex-col justify-between items-center rounded-2xl">
              <h2 className="h-fit text-4xl font-bold">Join Room</h2>
              <div className="body-container flex-1 flex justify-center items-center gap-2">
                <input
                  placeholder="Enter room code here"
                  className="py-2 px-4 border border-white rounded-xl"
                />
                <button className="py-2 px-4 bg-green-600 text-black rounded-xl cursor-pointer">
                  Search
                </button>
              </div>
            </div>

            <div className="right-container w-[95%] lg:w-[48%] h-70 max-h-100 border border-gray-600 p-5 flex flex-col justify-between items-center rounded-2xl">
              <h2 className="h-fit text-4xl font-bold">Create Room</h2>
              <div className="body-container flex-1 flex justify-center items-center gap-2">
                {accessToken ? (
                  <p className="text-green-400">✓ Spotify connected!</p>
                ) : (
                  <button
                    onClick={redirectToSpotify}
                    className="py-2 px-4 bg-green-600 text-black rounded-xl cursor-pointer"
                  >
                    Login with your Spotify
                  </button>
                  
                )}
                <button
                    onClick={getProfile}
                    className="py-2 px-4 bg-green-600 text-black rounded-xl cursor-pointer"
                  >
                    Get Profile
                  </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}