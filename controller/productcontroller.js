
import fs from 'fs'
import productmodel from "../model/productmodel.js"
import categoryModel from '../model/categoryModel.js'
import slugify from "slugify"
import braintree from 'braintree'
import ordermodel from '../model/ordermodel.js'
import dotenv from 'dotenv'

//payment getaway
dotenv.config()
var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files
        //validation of fields
        switch (true) {
            case !name:
                return res.status(500).send({ message: "name is required" })
            case !description:
                return res.status(500).send({ message: "description is required" })
            case !price:
                return res.status(500).send({ message: "price is required" })
            case !category:
                return res.status(500).send({ message: "category is required" })
            case !quantity:
                return res.status(500).send({ message: "quantity is required" })
            case photo && photo.size > 1000000:
                return res.status(500).send({ message: "photo is required and should be less than 1MB" })
        }

        // addind new product
        const product = new productmodel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.status(201).send({
            success: true,
            message: "new product added successfully...",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while creating product",
            error
        })
    }
}

export const getAllProductController = async (req, res) => {
    try {
        const products = await productmodel.find().select("-photo").limit(10).sort({ createdAt: -1 }).populate("category")
        res.status(200).send({
            success: true,
            message: "All products",
            products,
            total_products: products.length
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while getting products...",
            error
        })
    }
}

export const singleProductController = async (req, res) => {

    try {
        console.log(req.params._id)
        const product = await productmodel.findById({ _id: req.params._id }).select("-photo").populate("category")
        if (!product) {
            return res.status(404).send({ message: "product not found" })
        }
        res.status(200).send({
            success: true,
            message: "product details",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while getting a product",
            error
        })
    }
}

export const deleteProductController = async (req, res) => {
    try {
        const product = await productmodel.findByIdAndDelete({ _id: req.params._id })
        res.status(200).send({
            success: true,
            message: "delete product successfully",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while delete product",
            error
        })
    }
}

export const updateProductController = async (req, res) => {
    // console.log( req.fields)
    // console.log(req.files)
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        // updating existing product
        // console.log( req.params._id)
        const product = await productmodel.findByIdAndUpdate(
            req.params._id,
            { ...req.fields, slug: slugify(name) },
            { new: true })

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }
        await product.save()
        res.status(200).send({
            success: true,
            message: "product updated successfully...",
            product
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while update product",
            error
        })
    }
}

export const productPhotoController = async (req, res) => {
    try {
        const product = await productmodel.findById(req.params._id).select("photo")

        if (product.photo.data) {
            res.set('content-type', product.photo.contentType)
            return res.status(200).send(product.photo.data)

        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "erroe while gertting product photo",
            error
        })
    }
}

//filter
export const productControllerFilter = async (req, res) => {
    try {
        const { checked, radio } = req.body
        let args = {};
        if (checked.length > 0) args.category = checked
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] }
        const product = await productmodel.find(args)
        res.status(200).send({
            success: true,
            message: "filter successfully",
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while filtering record",
            error
        })
    }
}

//count
export const productCountController = async (req, res) => {
    try {
        const total = await productmodel.find({}).estimatedDocumentCount()
        res.status(200).send({
            success: true,
            message: "count successfull",
            total
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while product count",
            error
        })
    }
}

//list
export const productListController = async (req, res) => {
    try {
        const perpage = 2
        const page = req.params.page ? req.params.page : 1
        const product = await productmodel.find({})
            .select('-photo')
            .skip((page - 1) * perpage)
            .limit(perpage)
            .sort({ createdAt: -1 })

        res.status(200).send({
            success: true,
            product
        })

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error in product list",
            error
        })
    }
}

//search box
export const searchProductController = async (req, res) => {
    try {
        const { keyboard } = req.params
        const result = await productmodel.find({
            $or: [
                { name: { $regex: keyboard, $options: 'i' } },
                { description: { $regex: keyboard, $options: 'i' } }
            ]
        }).select('-photo')
        res.status(200).send({
            success: true,
            message: "list of product",
            result
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while searching.. product",
            error
        })
    }
}

//similar product
export const similarProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params
        const product = await productmodel.find({
            category: cid,
            _id: { $ne: pid }
        }).select("-photo").limit(3).populate("category")

        res.status(200).send({
            success: true,
            product
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "error while get similar product",
            error
        })


    }
}

//categorywise
export const productwiseCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        const product = await productmodel.find({ category }).populate('category')
        res.status(200).send({
            success: true,
            category,
            product
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while getting product wise category...",
            error
        })
    }
}

//payment gateway api
//token controller

export const braintreetokenController = async (req, res) => {

    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(response);

            }

        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "error while generating braintree token...",
            error,
        });
    }
}

//payment controller
export const braintreepaymentController = (req, res) => {

    try {
        const { nonce, cart } = req.body;
        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        let newTransaction = gateway.transaction.sale(
            {

                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
          async function (error, result) {
                if (result) {
                    const order =await new  ordermodel({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    res.json({ ok: true , order});
                    // console.log(order)
                    // console.log(req.user._id)
                } else {
                    res.status(500).send(error);
                }
                
            }
        );
    } catch (error) {
        console.log(error);
    }
}

export const OrderStatusController =async (req,res)=>{
 try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await ordermodel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
//  console.log(orders)
 } catch (error) {
    res.status(500).send({
        success:false,
        message:"error while updating status",
        error
    })
 }
}
