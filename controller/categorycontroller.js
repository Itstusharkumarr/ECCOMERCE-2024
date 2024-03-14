import slugify from "slugify"
import categoryModel from "../model/categoryModel.js"


export const createCategoryController = async(req,res)=>{
    try {
        const {name}=req.body
        //validation
        if(!name){
            return res.status(401).send({ message:"name is required"})
  
        }
         //existing category
         const existingCategory = await categoryModel.findOne({name})
         if(existingCategory){
           return res.status(200).send({
            success:true,
            message:"category already exist"
           })
         }
        //adding new category
        const category = await new categoryModel({
            name,
            slug:slugify(name)
        }).save()
        res.status(201).send({
            success:true,
            message:"new category created",
            category,
        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while creating category...",
            error
        })
    }
}

// get all categories controller
export const getAllCategoriesController = async(req,res)=>{
    try {
      const categories =  await categoryModel.find()
      res.status(200).send({
        success:true,
        message:"list of all categories",
        categories
      })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"erroe while getting categories",
            error
        })
    }
}

//get single category controller
export const getSingleCategoryController = async(req,res)=>{
    try {
       const category = await categoryModel.findOne({name:req.params.name})
       res.status(200).send({
        success:true,
        message:"single category",
        category
       })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error in getting a category",
            error
        })
    }
}

//delete category controller
export const deleteCategoryController = async(req,res)=>{
    try {

      await categoryModel.findByIdAndDelete({_id:req.params._id})
       res.status(200).send({
           success:true,
           message:"category delete successfull",
       })
    } catch (error) {
        res.status(500).send({
           success:false,
           message:"error while delete category",
           error
         
           })
        
    }
}

// update category controller
export const updateCategoryController = async(req,res)=>{
    try {
        const {_id}= req.params
        const {name}= req.body
        //validation
        if(!name){
            return res.status(401).send({message:"name is required"})
        }
       const updatecategory = await categoryModel.findByIdAndUpdate(_id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"category update successfully",
            updatecategory

        })
    } catch (error) {
        res.status(500).send({
            success:false,
            message:"error while in updating category",
            error
        })
        
    }
}