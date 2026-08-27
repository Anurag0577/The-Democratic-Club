import { useState } from "react"
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import useAuthStore from "../store/useAuthStore";
import { IoMdCloseCircleOutline } from "react-icons/io";

export function AuthModel(){


    const activeModel = useAuthStore(state => state.activeModel)
    const openLoginModel = useAuthStore(state => state.openLoginModel);
    const openSignupModel = useAuthStore(state => state.openSignupModel);
    const closeModel = useAuthStore(state => state.closeModel);
    const updateCurrentUserInfo = useAuthStore(state => state.updateCurrentUserInfo)


    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstnameError, setFirstnameError] = useState('')
    const [lastnameError, setLastnameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [resultError, setResultError] = useState('')

    function validateloginCredentials(email, password){
        setFirstnameError('')
        setLastnameError('')
        setEmailError('')
        setPasswordError('')

        if(!email){
            setEmailError('Email is required')
            return false
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setEmailError('Email syntax is wrong')
            return false
        }
        if(!password){
            setPasswordError('Password is required!')
            return false
        }
        if(password.length < 6){
            setPasswordError('Password must contain atleast 6 characters.')
            return false
        }
        if(!/[A-Z]/.test(password)){
            setPasswordError('Password must contain atleast one capital letter.')
            return false
        }
        if(!/[a-z]/.test(password)){
            setPasswordError('Password must contain atleast one small letter.')
            return false
        }
        if(!/[@#$%&*^]/.test(password)){
            setPasswordError('Password must contain atleast one special symbol.')
            return false
        }
        if(!/[\d]/.test(password)){
            setPasswordError('Password must contain atleast one number.')
            return false
        }

        return true
    }

    function validateSignupCredentials(firstname, lastname, email, password){
        setFirstnameError('')
        setLastnameError('')
        setEmailError('')
        setPasswordError('')

        if(!firstname){
            setFirstnameError('Firstname is required!')
            return false
        }
        if(firstname.length < 3){
            setFirstnameError("Firstname must contain atleast 3 characters.")
            return false
        }
        if(!lastname){
            setLastnameError('Lastname is required!')
            return false
        }
        if(lastname.length < 3){
            setLastnameError("Lastname must contain atleast 3 characters.")
            return false
        }
        if(!email){
            setEmailError('Email is required')
            return false
        }
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            setEmailError('Email syntax is wrong')
            return false
        }
        if(!password){
            setPasswordError('Password is required!')
            return false
        }
        if(password.length < 6){
            setPasswordError('Password must contain atleast 6 characters.')
            return false
        }
        if(!/[A-Z]/.test(password)){
            setPasswordError('Password must contain atleast one capital letter.')
            return false
        }
        if(!/[a-z]/.test(password)){
            setPasswordError('Password must contain atleast one small letter.')
            return false
        }
        if(!/[@#$%&*^]/.test(password)){
            setPasswordError('Password must contain atleast one special symbol.')
            return false
        }
        if(!/[\d]/.test(password)){
            setPasswordError('Password must contain atleast one number.')
            return false
        }

        return true
    }


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
        return response?.data?.data;
        },
        onSuccess: (data) => {
        setResultError('')
        updateCurrentUserInfo(data.accessToken);
        closeModel();
        },
        onError: (error) => {
        console.log('Error during login', error)
        setResultError(error?.response?.data?.message || 'Login failed. Please try again.')
        }
    })


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
        setResultError('')
        updateCurrentUserInfo(data.accessToken)
        closeModel();
      },
      onError: (error) => {
        console.error('Error registering user:', error)
        setResultError(error?.response?.data?.message || 'Signup failed. Please try again.')
      }
    })

    if (activeModel !== 'login' && activeModel !== 'signup') return null;

    return (
        <>
            <div className=" fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300" onClick={closeModel} >
            {
                (activeModel === 'login') ? (
                    <div className= " login-form-container  relative w-full max-w-92 h-100 max-h-98 p-8 rounded-3xl bg-[rgb(13,13,13)] border border-white/10 text-white shadow-2xl transition-all transform scale-100 flex flex-col justify-between " onClick={(e) => e.stopPropagation()}>
                        <IoMdCloseCircleOutline onClick={closeModel} className="absolute right-5 top-5 text-xl cursor-pointer"  />
                        <div className="form-header flex flex-col justify-center items-center">
                        <h3 className="form-heading text-2xl lg:text-3xl font-bold text-center tracking-tighter">Welcome back!</h3>
                        <p className="form-description text-center text-sm text-[#b6b6b6]">Enter your credentials to login to your account.</p>
                        </div>
                        <div className="flex flex-1 flex-col justify-center ">
                        <div className="form-body flex flex-col gap-y-3">

                        <div className="email">
                            <div className="form-feild">
                            <label htmlFor="login-email" className="email-label">Email</label>
                            <input 
                                id="login-email"
                                type="text" 
                                value={email} 
                                onChange={e => {
                                setEmail(e.target.value)
                                }}
                                className={`email my-2 border rounded px-3 h-9 ${  !emailError ? 'border-[#1f1f1f]' : 'border-red-500' }`}
                                required 
                            ></input>
                            <p className="text-sm text-red-600" >{emailError}</p>
                            </div>
                        </div>
                        <div className="password">
                            <div className="form-feild">
                            <label htmlFor="login-password" className="password-label">Password</label>
                            <input 
                                id="login-password"
                                type="password" 
                                value={password} 
                                onChange={e => {
                                setPassword(e.target.value)
                                }}
                                className={`password my-2 border border-[#1f1f1f] rounded px-3 h-9 ${ !passwordError ? 'border-[#1f1f1f]' : 'border-red-500' }`}
                                required 
                            ></input>
                            <p className="text-sm text-red-600" >{passwordError}</p>
                            </div>
                        </div>
                        </div>
                        <div className="form-button flex flex-col justify-center items-center mt-5">
                            <p className="text-sm text-red-600">{resultError}</p>
                            <button 
                                className="button form-submit text-black bg-white w-full py-1.5 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" 
                                disabled={loginUser.isPending}
                                onClick={() => {
                                    const isValid = validateloginCredentials(email, password);
                                    if(isValid){
                                        loginUser.mutate({email, password})
                                    }
                                }} 
                            >{loginUser.isPending ? 'Logging in...' : 'Login'}</button>
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
                            <h3 className="form-heading text-2xl lg:text-3xl font-bold text-center tracking-tighter">Create new account</h3>
                            <p className="form-description text-center text-sm text-[#b6b6b6]">We just need a few details to get you started.</p>
                            </div>
                            <div className="flex flex-1 flex-col justify-center ">
                            <div className="form-body flex flex-col gap-y-3">

                            <div className="name flex gap-x-3">
                                <div className="form-feild">
                                <label htmlFor="signup-firstname" className="firstname-label">Firstname</label>
                                <input 
                                    id="signup-firstname"
                                    type="text" 
                                    value={firstname} 
                                    onChange={e => {
                                    setFirstname(e.target.value)
                                    } } 
                                    className={`firstname my-2 border rounded px-3 h-9 ${ !firstnameError ? 'border-[#1f1f1f]' : 'border-red-500' }`}
                                    required
                                ></input>
                                <p className="text-sm text-red-600" >{firstnameError}</p>
                                </div>
                                <div className="form-feild">
                                <label htmlFor="signup-lastname" className="lastname-label">Lastname</label>
                                <input 
                                    id="signup-lastname"
                                    type="text" 
                                    value={lastname} 
                                    onChange={e => {
                                    setLastname(e.target.value)
                                    }}
                                    className={`lastname my-2 border rounded px-3 h-9 ${ !lastnameError ? 'border-[#1f1f1f]' : 'border-red-500' }`}
                                    required 
                                ></input>
                                <p className="text-sm text-red-600" >{lastnameError}</p>
                                </div>
                            </div>
                            <div className="email">
                                <div className="form-feild">
                                <label htmlFor="signup-email" className="email-label">Email</label>
                                <input 
                                    id="signup-email"
                                    type="text" 
                                    value={email} 
                                    onChange={e => {
                                    setEmail(e.target.value)
                                    }}
                                    className={`email my-2 border rounded px-3 h-9 ${ !emailError ? 'border-[#1f1f1f]' : 'border-red-500' }`}
                                    required 
                                ></input>
                                <p className="text-sm text-red-600" >{emailError}</p>
                                </div>
                            </div>
                            <div className="password">
                                <div className="form-feild">
                                <label htmlFor="signup-password" className="password-label">Password</label>
                                <input 
                                    id="signup-password"
                                    type="password" 
                                    value={password} 
                                    onChange={e => {
                                    setPassword(e.target.value)
                                    }}
                                    className={`password my-2 border rounded px-3 h-9 ${ !passwordError ? 'border-[#1f1f1f]' : 'border-red-500' }`}
                                    required 
                                ></input>
                                <p className="text-sm text-red-600"> {passwordError} </p>
                                </div>
                            </div>
                            </div>
                            <div className="form-button flex flex-col justify-center items-center mt-10">
                                <p className="text-sm text-red-600">{resultError}</p>
                                <button 
                                    className="button form-submit text-black bg-white w-full py-1.5 rounded cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" 
                                    disabled={signupUser.isPending}
                                    onClick={
                                        () => {
                                            const isValid = validateSignupCredentials(firstname, lastname, email, password)
                                            if(isValid){
                                                signupUser.mutate({firstname, lastname, email, password})
                                            }
                                        }
                                    } 
                                >{signupUser.isPending ? 'Creating...' : 'Create'}</button>
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