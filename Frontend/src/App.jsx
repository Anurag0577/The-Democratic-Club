import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const response = fetch('http://localhost:3000/')
    response.then((res) => res.json()).then(setData)
  }, [])
  
  console.log('Data fetched successfully:', data)
  return (
    <>
      <h1>{data}</h1>
    </>
  )
}

export default App