

export async function register(req,res) {
    res.json('register route')
}
export async function login(req,res) {
    res.json('LogIn')
}

export async function getUser(req,res) {
    res.json('get user')
}

export async function updateUser(req,res) {
    res.json('update user')
}
export async function generateOTP(req,res) {
    res.json('generate otp route')
}

export async function veriyOTP(req,res) {
    res.json('veriyOTP')
}

export async function createResetSession(req,res) {
    res.json('reset session')
}

export async function resetPassword(req,res) {
    res.json('resetPassword route')
}