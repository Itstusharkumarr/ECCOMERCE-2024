
import bcrypt from 'bcrypt';
import JWT from "jsonwebtoken";
import usermodel from "../model/usermodel.js";
import ordermodel from '../model/ordermodel.js';

export const registrationController = async (req, res) => {
   try {
      const { name, email, password, phone, address, answer } = req.body;
      //  validation
      if (!name)
         return res.status(400).send({ message: "Name is required" });
      if (!email)
         return res.status(400).send({ message: "Email is required" });
      if (!password)
         return res.status(400).send({ message: "Password is required" });
      if (!phone)
         return res.status(400).send({ message: "Phone no  is required" });
      if (!address)
         return res.status(400).send({ message: "Address is required" });
      if (!answer)
         return res.status(400).send({ message: "Answer is required" });

      // existing user
      const existingUser = await usermodel.findOne({ email })
      if (existingUser) {
         res.status(200).send({
            success: false,
            message: "User already registered. Click on login",
            existingUser
         })
      }
      // new user

      const hashPassword = await bcrypt.hash(password, 10)

      const user = new usermodel({
         name: name,
         email: email,
         password: hashPassword,
         phone: phone,
         address: address,
         answer: answer
      })
      await user.save()
      res.status(201).send({
         success: true,
         message: "User registered successfully.",
         user
      })


   } catch (error) {
      res.status(500).send({
         success: false,
         message: "error while register a new user",
         error
      })
   }
}

export const loginController = async (req, res) => {
   try {
      const { email, password, _id } = req.body;
      // console.log(req.body);
      // validation
      if (!email || !password) {
         return res.status(404).send({
            success: false,
            message: "please fill all the fields!!",
         })
      }


      // check user is registered or not
      const user = await usermodel.findOne({ email })
      if (!user) {
         return res.status(404).send({
            success: false,
            message: "User is not registered Please register first!",
         })
      }

      // compare password
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
         return res.status(200).send({
            success: false,
            message: "invalid password"
         })
      }

      //   generating token
      const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "2hr" })
      // console.log(token)
      res.status(200).send({
         success: true,
         message: "login successfull!",
         user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
         },
         token
        
      })



   } catch (error) {
      res.status(500).send({
         success: false,
         message: "error while login...",
         error

      })
   }
}

export const forgotPasswordController = async (req, res) => {
   try {
      const { email, answer, newPassword } = req.body
      // console.log(req.body)
      //validation
      if (!email) {
         return res.status(400).send({ message: "email is required" })
      }
      if (!answer) {
         return res.status(400).send({ message: "answer is required" })
      }
      if (!newPassword) {
         return res.status(400).send({ message: "new password  is required" })
      }
      //check
      const user = await usermodel.findOne({ email, answer })
      if (!user) {
         return res.status(404).send({
            success: false,
            message: "wrong email and answer!"
         })
      }
      const hashed = await bcrypt.hash(newPassword, 10)
      await usermodel.findByIdAndUpdate(user._id, { password: hashed })
      res.status(200).send({
         success: true,
         message: "password reset successfully"
      })
   } catch (error) {
      res.status(500).send({
         success: false,
         message: "error in forget password",
         error
      })
   }
}

export const Profilecontroller = async (req, res) => {
   try {
      const { name, email, password, address, phone } = req.body;
      // console.log(req.body)
      // console.log(req.params._id)
      const user = await usermodel.findById(req.params._id)

      if (!password || password.length < 6) {
         return res.status(404).send({
            error: "Password is required and must be 6 characters long!!",
         });
      }

      const hashPassword = password ? await bcrypt.hash(password, 10) : undefined

      const updateuser = await usermodel.findByIdAndUpdate(req.params._id, {
         name: name || user.name,
         password: hashPassword || user.password,
         phone: phone || user.phone,
         address: address || user.address,
      }, { new: true })

      res.status(200).send({
         success: true,
         message: "user update successfully",
         updateuser
      })
   } catch (error) {
      res.status(500).send({
         success: false,
         message: "something went wrong while updating user",
         error
      })
      // console.log(error)

   }
}

export const getrorderController = async (req, res) => {
   try {
      const orders = await ordermodel.find({ buyer: req.user._id }).populate('products', "-photo").populate("buyer", "name")
      res.json(orders)
      // console.log(orders )
      
   } catch (error) {
      res.status(500).send({
         success: false,
         message: "error in getting order",
         error
      })
   }

}

export const getAllOrderController = async(req,res)=>{
   try {
      const orders = await ordermodel.find({  }).populate('products', "-photo").populate("buyer", "name").sort({createdAt:"-1"})
      res.json(orders)
      // console.log(orders )
      
   } catch (error) {
      res.status(500).send({
         success: false,
         message: "error in getting all order",
         error
      })
   }
}
//test
// export const testController = (req,res)=>{
// res.send("protected route")
// }