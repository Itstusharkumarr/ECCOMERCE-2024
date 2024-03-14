import express from "express"
import { Profilecontroller, forgotPasswordController, getAllOrderController, getrorderController, loginController, registrationController } from "../controller/authcontroller.js"
import { isAdmin, requiresignin } from "../middleware/authmiddleware.js"

const router = express.Router()

//register routing
router.post('/register', registrationController)
// Login routing
router.post('/login', loginController)
// forget password
router.post('/forgot-password', forgotPasswordController)
// user route
router.get("/user-auth", requiresignin, (req, res) => {
    res.status(200).send({ ok: true })
})
// admin route
router.get("/admin-auth", requiresignin, (req, res) => {
    res.status(200).send({ ok: true })
})

// update profile
router.put('/profile/:_id', Profilecontroller)

//oders
router.get('/order', requiresignin, getrorderController)

//adminorder
router.get('/all-orders', requiresignin, getAllOrderController)

//test
// router.get('/test',requiresignin,isAdmin,testController)

export default router