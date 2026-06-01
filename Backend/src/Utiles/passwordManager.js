import bcrypt from 'bcrypt'

const SALT_ROUND_CYCLE = 10 // generally recommanded!

// hash the password
async function passwordHashing(plainPassword){
    try{
        const salt = await bcrypt.genSalt(SALT_ROUND_CYCLE)
        const hashedPassword = await bcrypt.hash(plainPassword);
        return hashedPassword;
    } catch(err){
        throw new Error('Password hashing failed!', err.message)
    }
}

// compare plainPassword with hashedPassword
async function passwordCompare(plainPassword, hashedPassword){
    try{
        const isPasswordSame = bcrypt.compare(plainPassword, hashedPassword)
    } catch(err){
        throw new Error('Password comparision failed!', err)
    }
}


// checking password strength
async function checkingPasswordStrength(password){
    const containUpperLetter = /^[A-Z]+$/.test(password);
    const containLowerLetter = /^[a-z]+$/.test(password);
    const containNumber = /^[0-9]+$/.test(password)
    const containSpecialSymbole = /^[~`!@#$%^&*()_+-={}|:";'<>?,.]+$/.test(password)

    const errors = []; // array to contain all the strength related remarks

    if()
}