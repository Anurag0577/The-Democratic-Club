import { ApiResponse } from "../Utiles/ApiResponse";
import { ApiError } from "../Utiles/ErrorHandler";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { asyncHandler } from "../Utiles/asyncHandler";

// MIDDLEWARE FOR AUTHENTICATION
const authMiddleware = asyncHandler(async(req, res, next) => {
    const authHeader = req.header['authorization' || 'Authorization'];
    if(!authHeader) throw new ApiError(401, 'There is no authHeader in the request header!')
    
    const accessToken = authHeader && authHeader.split(' ')[1];
    
    if(!accessToken) throw new ApiError(401, 'AccessToken is missing!');

    // Verify whether token is expired or not
    const decodedAccessToken =  jwt.verify(accessToken, process.env.REFRESH_TOKEN_EXPIRY)
    console.log("Here is the decoded access token", decodedAccessToken)
    req.user = decodedAccessToken; // this contain user information
    next() // move to the next middleware
    
})

export {authMiddleware};