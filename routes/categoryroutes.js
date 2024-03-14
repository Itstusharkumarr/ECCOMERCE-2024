import express from 'express'
import { createCategoryController, deleteCategoryController, getAllCategoriesController, getSingleCategoryController, updateCategoryController } from '../controller/categorycontroller.js'



const router = express.Router()
// create category route
router.post("/create-category",createCategoryController)

//get all category
router.get("/all-categories",getAllCategoriesController)

//single category
router.get("/single-category/:name",getSingleCategoryController)

//delete category
router.delete("/delete-category/:_id",deleteCategoryController)

//update category
router.put("/update-category/:_id",updateCategoryController)

export default router