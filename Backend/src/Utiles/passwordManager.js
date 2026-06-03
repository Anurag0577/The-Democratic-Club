import bcrypt from 'bcrypt'

const SALT_ROUND_CYCLE = 10 // generally recommanded!

// hash the password
async function passwordHashing(plainPassword){
    try{
        const salt = await bcrypt.genSalt(SALT_ROUND_CYCLE)
        const hashedPassword =  await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch(err){
        throw new Error('Password hashing failed!', err.message)
    }
}

// compare plainPassword with hashedPassword
async function passwordCompare(plainPassword, hashedPassword){
    try{
        const isPasswordSame = await bcrypt.compare(plainPassword, hashedPassword)
        console.log('isPasswordSame value: ', isPasswordSame)
        return isPasswordSame;
    } catch(err){
        throw new Error('Password comparision failed!', err)
    }
}

// Checking strength of the password
async function checkingPasswordStrength(password) {
    // Corrected RegEx: Just search for the presence of the characters anywhere
    const containUpperLetter = /[A-Z]/.test(password);
    const containLowerLetter = /[a-z]/.test(password);
    const containNumber = /[0-9]/.test(password);
    
    // Escaped special characters safely inside a character set
    const containSpecialSymbol = /[~`!@#$%^&*()_+\-={}\[\]|:";'<>?,.\/]/.test(password);

    const errors = []; 

    if (!containUpperLetter) {
        errors.push('Make sure password contains at least one uppercase letter.');
    }
    if (!containLowerLetter) {
        errors.push('Make sure password contains at least one lowercase letter.');
    }
    if (!containNumber) {
        errors.push('Make sure password contains at least one number.');
    }
    if (!containSpecialSymbol) {
        errors.push('Make sure password contains at least one special symbol.');
    }    

    // Added a standard length check as well (highly recommended for passwords!)
    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long.');
    }

    console.log('Is password completely valid?: ', errors.length === 0);
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

export {passwordHashing, passwordCompare, checkingPasswordStrength};