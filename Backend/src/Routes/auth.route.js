import express from 'express'
import { userLogin, userRegistration } from '../Controllers/auth.controller.js'

const router = express.Router();

router.post('/login', userLogin)
router.post('/signup', userRegistration)


// In the future, you have to create few more routes like forget password and create new password etc.

export default router;