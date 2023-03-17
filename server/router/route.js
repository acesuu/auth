import { Router } from "express";

const router = Router();

import * as controller from '../controllers/appController.js'
import Auth, {localVariables} from "../middleware/auth.js";
import { registerMail } from "../controllers/mailer.js";


//post
router.route('/register').post(controller.register)
router.route('/registerMail').post(registerMail)
router.route('/authentic').post((req,res) => res.end())
router.route('/login').post(controller.verifyUser,controller.login)

//get
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP) // generate random OTP
router.route('/verifyOTP').get(controller.verifyOTP)
router.route('/createResetSession').get(controller.createResetSession)

//put
router.route('/updateuser').put(Auth,controller.updateUser)
router.route('/resetpassword').put(controller.verifyUser, controller.resetPassword)



export default router;