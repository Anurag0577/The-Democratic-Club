import { useState } from "react"
import logo_img from '../assets/Images/the_democratic_club_logo_white.png'; 
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router";

export function Login(){

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  const {updateCurrentUserInfo} = useAuthStore();
  const loginUser = useMutation({
    mutationKey: ['loginUser'],
    mutationFn: async({email, password}) => {
      const response = await api.post('/user/login', {
        email,
        password
      },
      {
        withCredentials: true
      }
    )
      return response.data.data;
    },
    onSuccess: (data) => {
      updateCurrentUserInfo(data.accessToken);
      navigate('/');
    },
    onError: (error) => {
      console.log('Error during login', error)
    }
  })
  

    return (
        <>
            <div className="page-container h-screen flex flex-col lg:flex-row bg-black text-white ">
              <div className="left-container w-full  lg:w-[50%] flex items-center justify-center">
                <img src={logo_img} alt="The Democratic Club logo" className="w-auto max-h-20 lg:w-full lg:max-h-fit" />
              </div>
              <div className="right-container w-full flex-1 lg:w-[50%] flex justify-center items-center ">
                <div className="signup-form-container  max-w-85 w-[80%] flex flex-col justify-center gap-y-10 border border-[#1f1f1f] rounded-xl p-5 h-[70%] lg:h-[80%] lg:max-h-[520px] ">
                    <div className="form-header flex flex-col justify-center items-center">
                      <h3 className="form-heading text-2xl font-bold text-center tracking-tighter">Welcome back!</h3>
                      <p className="form-description text-center text-sm text-[#b6b6b6]">Enter your credentials to login to your account.</p>
                    </div>
                    <div className="form-body flex flex-col gap-y-3">
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
                    <div className="form-button flex flex-col justify-center items-center">
                        <button className="button form-submit text-black bg-white w-full py-1.5 rounded" onClick={() => loginUser.mutate({email, password})} >Login</button>
                        <p className="text-[12px] text-[#b6b6b6] mt-1" >Don't have account? 
                          <a href="/signup" className="pl-1 italic underline">Create account.</a>
                        </p>
                    </div>
                </div>
              </div>
            </div>
        </>
    )
}