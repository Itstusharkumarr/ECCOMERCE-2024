import express from 'express'
import ExpressFormidable from 'express-formidable'
import { OrderStatusController, braintreepaymentController, braintreetokenController, createProductController,
     deleteProductController,
      getAllProductController,
      productControllerFilter,
      productCountController,
      productListController,
      productPhotoController,
      productwiseCategoryController,
      searchProductController,
      similarProductController,
      singleProductController, 
      updateProductController } from '../controller/productcontroller.js'
import { isAdmin, requiresignin } from '../middleware/authmiddleware.js'


const router = express.Router()

// post route
router.post("/add-product",ExpressFormidable(),createProductController)

//get product route
router.get("/all-product",ExpressFormidable(),getAllProductController)

//single product route
router.get("/single-product/:_id",ExpressFormidable(),singleProductController)

//photo routes
router.get("/product-photo/:_id",ExpressFormidable(),productPhotoController)

//delete product route
router.delete("/delete-product/:_id",ExpressFormidable(),deleteProductController)

//update product route
router.put("/update-product/:_id",ExpressFormidable(),updateProductController)

//filter
router.post('/filter-product',productControllerFilter)

//products count
router.get('/product-count',productCountController)

//list
router.get('/product-list/:page',productListController)

//search box
router.get('/product-search/:keyboard',searchProductController)

//similar product
router.get('/related-product/:pid/:cid',similarProductController)

//categorywise controller
router.get('/productwise-category/:slug',productwiseCategoryController)

//payment gateway route
//token
router.get('/braintree/token',braintreetokenController)
router.post('/braintree/payment',requiresignin,braintreepaymentController)
router.put('/order-status/:orderId',requiresignin,isAdmin,OrderStatusController)

export default router