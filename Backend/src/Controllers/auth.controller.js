import { asyncHandler } from '../Utiles/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { User } from '../Models/user.model.js';
import { ApiResponse } from '../Utiles/ApiResponse.js';
import { ApiError } from '../Utiles/ErrorHandler.js';
import { genAccessToken, genRefreshToken } from '../Utiles/jwt.js';
import { passwordCompare } from '../Utiles/passwordManager.js';
import 'dotenv/config'


// POST REQUEST: REGISTER NEW USER --------------------------------------------
const userRegistration = asyncHandler(async(req, res) => {
    const {firstname, lastname, email, password} = req.body;

    // check user already exist or not
    const existUser = await User.findOne({email});
    if(existUser){
        throw new ApiError(409, "User already Exist!")
    }

    const newUser = await User.create({
        firstname,
        lastname,
        email,
        password
    })

    // generate accessToken and refreshToken
    const accessToken = genAccessToken(newUser);
    const refreshToken = genRefreshToken(newUser)

    // Save refresh token to DB
    await User.findByIdAndUpdate(newUser._id, { refreshToken });

    const response = {
        _id: newUser._id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        accessToken,
    }

    // sending refresh token but in cookies

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        // secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 * 1000
    })

    // sending response
    res.status(200).json(new ApiResponse(200, 'User registration successfull!', response))
})


// POST REQUEST: LOGIN USER ---------------------------------------------
const userLogin = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    // found the complete user detail with the help of email
    const foundUser = await User.findOne({email});
    console.log('This is user which is found', foundUser)
    if(!foundUser){
        throw new ApiError(404, 'User not found! Please create your accound first!')
    }

    // check whether the password is same or not
    const isPasswordSame = await passwordCompare(password, foundUser.password);
    if(isPasswordSame){

        const accessToken = genAccessToken(foundUser);
        console.log('accesstoken generated in login')
        const refreshToken = genRefreshToken(foundUser);
        console.log('refreshtoken generated in login')

        await User.findByIdAndUpdate(foundUser._id, {refreshToken})

        const response = {
            _id: foundUser._id,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname,
            email: foundUser.email,
            accessToken
        }

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'strict',
            maxAge: 7*24*60*60*1000
        })

        return res.status(200).json(new ApiResponse(200, "User login successfull", response))
    } else{
        return res.status(401).json(new ApiResponse(401, 'User login failed! Please enter correct email or password.'))
    }

})

// GET REQUEST: REGENERATE ACCESSTOKEN FROM REFRESH TOKEN --------------------------------------
const tokenRegeneration = asyncHandler( async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    // if there is no refresh token throw error
    if(!incomingRefreshToken) throw new ApiError(401, 'Did not find incoming refresh token!')
        
    try {
        console.log('before decoded user')
        const decodedUser = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log('after decoded user', decodedUser)
        if(!decodedUser) throw new ApiError(401, 'Incoming refresh token verification failed!')
        // find user via decoded user email
        const foundUser = await User.findOne({email: decodedUser.email})
        if(!foundUser || foundUser.refreshToken !== incomingRefreshToken ) throw new ApiError(401, 'Refresh token is expired or used')

        // generate access token
        const accessToken =  genAccessToken(foundUser);

        return res.status(200).json(new ApiResponse(200, 'Access token regenerated!', {accessToken}))

    } catch (err) {
        console.log('this is the error reason', err)
        throw new ApiError(401, "Invalid Refresh Token");
    }

})

// GET:  GET USER DETAILS -----------------------------------------------------------
const getCurrentUser = asyncHandler( async(req, res) => {
    
    if(!req.user || !req.user._id){
        throw new ApiError(401, 'Unauthorized request!')
    }

    const foundUser = await User.findById(req.user._id)
    return res.status(200).json(new ApiResponse(200, "User details fetched successfully!", foundUser));
})

export {userLogin, userRegistration, tokenRegeneration, getCurrentUser};