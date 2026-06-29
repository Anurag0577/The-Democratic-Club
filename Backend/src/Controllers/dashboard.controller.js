import { ApiResponse } from "../Utiles/ApiResponse.js";
import { asyncHandler } from "../Utiles/asyncHandler.js";

// Just writing a protected route to test things
const secretInfo = asyncHandler((req, res) => {
    // Returning basic information to show on the UI
    res.status(200).json(new ApiResponse(200, 'This is very secret infomation'))
})

export {secretInfo}

// 