import express from 'express'
import { userLogin, userRegistration, tokenRegeneration } from '../Controllers/auth.controller.js'

const router = express.Router();

router.post('/login', userLogin)
router.post('/signup', userRegistration)
router.post('/newAccessToken', tokenRegeneration)


// In the future, you have to create few more routes like forget password and create new password etc.

export default router;