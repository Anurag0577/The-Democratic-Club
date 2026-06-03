import jwt from 'jsonwebtoken'
import 'dotenv/config';

function genAccessToken(user){
    const payload = {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        tokenType: 'access'
    }

    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRY} )
}


// generate refresh token
function genRefreshToken(user){
    const payload = {
        id: user._id,
        email: user.email,
        tokenType: 'refresh'
    }

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

// function to verify accessToken
function verifyAccessToken(accessToken){
    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        if(decodedToken.tokenType !== 'access') throw new Error('Invalid token type!')
        return decodedToken;
    } catch (err) {
        console.log('Access Token expired!', err)
        throw new Error("Access Token expired!")
    }
}


// function to verify refreshToken
function verifyRefreshToken(token){
    try {
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        if(decodedToken.tokenType !== 'refresh') throw new Error('Invalid token type!')
        return decodedToken;
    } catch (err) {
        console.log('Refresh token expired!', err)
        throw new Error('Refresh token exppired!')
    }
}

export {genAccessToken, genRefreshToken, verifyAccessToken, verifyRefreshToken};