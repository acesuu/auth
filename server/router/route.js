import { Router } from "express";

const router = Router();

import * as controller from '../controllers/appController.js'


//post
router.route('/register').post(controller.register)
// router.route('/registerMail').post()
router.route('/authentic').post((req,res) => res.end())
router.route('/login').post()

//get
router.route('/user/:username').get(controller.getUser)
router.route('/generateOTP').get(controller.generateOTP)
router.route('verifyOTP').get(controller.veriyOTP)
router.route('/createResetSession').get(controller.createResetSession)

//put
router.route('/updateuser').put(controller.updateUser)
router.route('/resetpassword').put(controller.resetPassword)



export default router;