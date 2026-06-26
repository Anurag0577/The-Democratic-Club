import { useState } from "react"
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import useAuthStore from "../store/useAuthStore";
import { useNavigate } from "react-router";
import { IoMdCloseCircleOutline } from "react-icons/io";

export function AuthModel(){

    // store variable
    const activeModel = useAuthStore(state => state.activeModel)
    const openLoginModel = useAuthStore(state => state.openLoginModel);
    const openSignupModel = useAuthStore(state => state.openSignupModel);
    const closeModel = useAuthStore(state => state.closeModel);
    const updateCurrentUserInfo = useAuthStore(state => state.updateCurrentUserInfo)

    // state variables
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();

    //  function for handling login
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
        closeModel();
        },
        onError: (error) => {
        console.log('Error during login', error)
        }
    })
    
    //  function for handling signup
    const signupUser = useMutation({
      mutationKey: ['userSignup'],
      mutationFn: async ({firstname, lastname, email, password}) => {
        const response = await api.post('/user/signup', {
          firstname, 
          lastname,
          email,
          password
        },{
          withCredentials: true
        })

        return response.data.data;
      },
      onSuccess: (data) => {
        updateCurrentUserInfo(data.accessToken)
        closeModel();
      },
      onError: (error) => console.error('Error registering user:', error)
    })

    if (!activeModel) return null;

        return (
            <>
                <div className=" fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={closeModel} >
                {
                    (activeModel === 'login') ? (
                        <div className= " login-form-container  relative w-full max-w-92 h-100 max-h-98 p-8 rounded-[24px] bg-[rgb(13,13,13)] border border-white/10 text-white shadow-2xl transition-all transform scale-100 flex flex-col justify-between " onClick={(e) => e.stopPropagation()}>
                        <IoMdCloseCircleOutline onClick={closeModel} className="absolute right-5 top-5 text-xl cursor-pointer"  />
                        <div className="form-header flex flex-col justify-center items-center">
                        <h3 className="form-heading text-2xl font-bold text-center tracking-tighter">Welcome back!</h3>
                        <p className="form-description text-center text-sm text-[#b6b6b6]">Enter your credentials to login to your account.</p>
                        </div>
                        <div className="flex flex-1 flex-col justify-center ">
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
                        <div className="form-button flex flex-col justify-center items-center mt-5">
                            <button className="button form-submit text-black bg-white w-full py-1.5 rounded cursor-pointer" onClick={() => loginUser.mutate({email, password})} >Login</button>
                            <p className="text-[12px] text-[#b6b6b6] mt-1" >Don't have account? 
                            <a onClick={openSignupModel} className="pl-1 italic underline cursor-pointer" >Create account.</a>
                            </p>
                        </div>
                        </div>
                    </div>
                    )
                    :
                    (
                        <div className="signup-form-container  relative w-full max-w-92 h-125 max-h-140 p-8 rounded-[24px] bg-[rgb(13,13,13)] border border-white/10 text-white shadow-2xl transition-all transform scale-100 flex flex-col justify-between " onClick={(e) => e.stopPropagation()}>
                            <IoMdCloseCircleOutline onClick={closeModel} className="absolute right-5 top-5 text-xl cursor-pointer"  />
                            <div className="form-header flex flex-col justify-center items-center">
                            <h3 className="form-heading text-2xl font-bold text-center tracking-tighter">Create new account</h3>
                            <p className="form-description text-center text-sm text-[#b6b6b6]">We just need a few details to get you started.</p>
                            </div>
                            <div className="flex flex-1 flex-col justify-center ">
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
                            <div className="form-button flex flex-col justify-center items-center mt-10">
                                <button className="button form-submit text-black bg-white w-full py-1.5 rounded cursor-center" onClick={() => signupUser.mutate({firstname, lastname, email, password})} >Create</button>
                                <p className="text-[12px] text-[#b6b6b6] mt-1" >Already have an account? 
                                <a onClick={openLoginModel} className="pl-1 italic underline cursor-pointer">Login.</a>
                                </p>
                            </div>
                            </div>
                    </div>
                    )
                }
                    

                </div>
            </>
        )
    }