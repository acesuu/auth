import UserModel from '../model/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

/** middleware for verify user */
export async function verifyUser(req, res, next){
    try {
        
        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error : "Can't find User!"});
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error"});
    }
}


export async function register(req, res) {
    try {
      const { username, password, profile, email } = req.body;
  
      // Check for existing username
      const user = await UserModel.findOne({ username });
      if (user) {
        return res.status(400).send({ error: "Please use unique username" });
      }
  
      // Check for existing email
      const existingEmail = await UserModel.findOne({ email });
      if (existingEmail) {
        return res.status(400).send({ error: "Please use unique email" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user object
      const newUser = new UserModel({
        username,
        password: hashedPassword,
        profile: profile || "",
        email,
      });
  
      // Save the user to the database
      const savedUser = await newUser.save();
  
      // Return success response
      res.status(201).send({ msg: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Unable to register user" });
    }
  }


export async function login(req, res) {
    const { username, password } = req.body;
  
    try {
      // Find the user in the database
      const user = await UserModel.findOne({ username });
  
      // If user not found, return error response
      if (!user) {
        return res.status(404).send({ error: "Username not found" });
      }
  
      // Check the password
      const passwordCheck = await bcrypt.compare(password, user.password);
  
      // If password doesn't match, return error response
      if (!passwordCheck) {
        return res.status(400).send({ error: "Password does not match" });
      }
  
      // Create a JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.username,
        },
        ENV.JWT_SECRET,
        { expiresIn: "24h" }
      );
  
      // Return success response with token
      return res.status(200).send({
        msg: "Login successful",
        username: user.username,
        token,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Unable to login" });
    }
  }


export async function getUser(req, res) {
    const { username } = req.params;
  
    try {
      if (!username) {
        return res.status(400).send({ error: "Invalid username" });
      }
  
      const user = await UserModel.findOne({ username }).lean();
  
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
  
      // Remove password from user object
      const { password, ...rest } = user;
  
      return res.status(200).send(rest);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Internal server error" });
    }
  }


export async function updateUser(req,res){
    try {
        
        const { userId } = req.user;

        if(userId){
            const body = req.body;

            // update the data
            const result = await UserModel.updateOne({ _id : userId }, { $set: body }).exec();

            return res.status(201).send({ msg : "Record Updated...!"});

        }else{
            return res.status(401).send({ error : "User Not Found...!"});
        }

    } catch (error) {
        return res.status(401).send({ error });
    }
}


/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
    try{
        req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
        res.status(201).send({ code: req.app.locals.OTP })
    }
    catch(e)
    {
        console.log(e)
    }
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
         return res.status(201).send({ flag : req.app.locals.resetSession})
    }
    return res.status(440).send({error : "Session expired!"})
 }
 

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {
      if (!req.app.locals.resetSession)
        return res.status(440).send({ error: "Session expired!" });
  
      const { username, password } = req.body;
  
      try {
        const user = await UserModel.findOne({ username });
        if (!user) return res.status(404).send({ error: "Username not Found" });
  
        const hashedPassword = await bcrypt.hash(password, 10);
        await UserModel.updateOne(
          { username: user.username },
          { password: hashedPassword }
        );
        req.app.locals.resetSession = false; // reset session
        return res.status(201).send({ msg: "Record Updated...!" });
      } catch (error) {
        return res.status(500).send({ error: "Enable to hashed password" });
      }
    } catch (error) {
      return res.status(401).send({ error });
    }
  }