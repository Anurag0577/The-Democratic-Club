import { useEffect, useState } from "react"
import logo_img from '../assets/Images/the_democratic_club_logo_white.png'; 
export function Signup(){

    const [data, setData] = useState(null)
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

  useEffect(() => {
    const response = fetch('http://localhost:3000/', {
      method: 'GET',
      credentials: 'include'
    })
    response.then((res) => res.json())
    .then(setData)
  }, [])

  const handleSignup = async() => {
    fetch('http://localhost:3000/user/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({firstname, lastname, email, password}),
    })
    .then(response => response.json())
    .then(data => console.log(data))
  }
  
  console.log('Data fetched successfully:', data)
    return (
        <>
            <div className="page-container h-screen flex flex-col lg:flex-row bg-black text-white ">
              <div className="left-container w-full  lg:w-[50%] flex items-center justify-center">
                <img src={logo_img} alt="The Democratic Club logo" className="w-auto max-h-[80px] lg:w-full lg:max-h-fit" />
              </div>
              <div className="right-container w-full flex-1 lg:w-[50%] flex justify-center items-center ">
                <div className="signup-form-container  max-w-[340px] w-[80%] flex flex-col justify-center gap-y-10 border-1 border-[#1f1f1f] rounded-xl p-5 h-[80%] lg:h-[80%] lg:max-h-[520px] ">
                    <div className="form-header flex flex-col justify-center items-center">
                      <h3 className="form-heading text-2xl font-bold text-center tracking-tighter">Create new account</h3>
                      <p className="form-description text-center text-sm">We just need a few details to get you started.</p>
                    </div>
                    <div className="form-body flex flex-col gap-y-3">
                      <div className="name flex gap-x-3">
                        <div className="form-feild">
                          <label htmlFor="firstname" className="firstname-label">Firstname</label>
                          <input 
                            type="text" 
                            value={firstname} 
                            onChange={e => {
                              e.preventDefault();
                              setFirstname(e.target.value)
                            } } 
                            className="firstname my-2 border border-[#1f1f1f] rounded px-3 h-9"  
                            required
                          ></input>
                        </div>
                        <div className="form-feild">
                          <label htmlFor="lastname" className="lastname-label">Lastname</label>
                          <input 
                            type="text" 
                            value={lastname} 
                            onChange={e => {
                              e.preventDefault();
                              setLastname(e.target.value)
                            }}
                            className="lastname my-2 border border-[#1f1f1f] rounded px-3 h-9"
                            required 
                          ></input>
                        </div>
                      </div>
                      <div className="email">
                        <div className="form-feild">
                          <label htmlFor="email" className="email-label">Email</label>
                          <input 
                            type="text" 
                            value={email} 
                            onChange={e => {
                              e.preventDefault();
                              setEmail(e.target.value)
                            }}
                            className="email my-2 border border-[#1f1f1f] rounded px-3 h-9"
                            required 
                          ></input>
                        </div>
                      </div>
                      <div className="password">
                        <div className="form-feild">
                          <label htmlFor="password" className="password-label">Password</label>
                          <input 
                            type="text" 
                            value={password} 
                            onChange={e => {
                              e.preventDefault();
                              setPassword(e.target.value)
                            }}
                            className="password my-2 border border-[#1f1f1f] rounded px-3 h-9"
                            required 
                          ></input>
                        </div>
                      </div>
                    </div>
                    <div className="form-button">
                        <button className="button form-submit text-black bg-white w-full py-1.5 rounded" onClick={handleSignup}>Create</button>
                    </div>
                </div>
              </div>
            </div>
        </>
    )
}