import  Jwt from "jsonwebtoken"
import userModel from "../model/usermodel.js"

export const requiresignin = async(req,res,next)=>{
    try {
        const decode = Jwt.verify(req.headers.authorization,process.env.JWT_SECRET_KEY);
        req.user=decode
        next()

    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while sign in..",
            error
        })
    }
}

export const isAdmin= async(req,res,next)=>{
    try {
      
     const user = await  userModel.findById( req.user._id)
      if(user.role!==1){
        return res.status(201).send({
            success:false,
            message:"unauthorise access"
        })
      }
      else{
        next()
      }
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error in checking admin",
            error
        })
    }
}