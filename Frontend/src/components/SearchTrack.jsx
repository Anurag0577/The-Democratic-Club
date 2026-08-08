import { useQuery } from "@tanstack/react-query";
import { useState } from "react"

export function SearchTrack() {
    
    const spotify_access_token = localStorage.getItem('spotify_access_token')
    
    // state
    const [searchString, setSearchString] = useState('doxy');
    
    // generate a query string using URLSearchParams
    const baseSpotifySearchURL = 'https://api.spotify.com/v1/search';
    const params = new URLSearchParams({
        q: `remaster track:${searchString}`,
        type: 'track',
        limit: 5,
        offset: 2,
        include_external: 'audio'
    })
    
    const queryString = `${baseSpotifySearchURL}?${params.toString()}`

    async function fetchSearchTrack(){
        const res = await fetch(queryString, {
            headers: {
                Authorization: `Bearer ${spotify_access_token}`
            }
        })
        console.log('this is response from spotify: ', res)
    } 

    console.log('This is query string:',queryString)
    // hit the spotify web API but using react query

    const {data} = useQuery({
        queryKey: 'spotify-search',
        queryFn: fetchSearchTrack(queryString)
    })
    
    return <>
        <input
            type="text"
            placeholder="Search songs..."
            className={`w-full bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-lime-400/50 transition-colors duration-200 py-3 px-2`}
            value={searchString}
            onChange={(e) => {
                setSearchString(e.target.value)
                console.log(searchString)
            }}
        />
    </>
}