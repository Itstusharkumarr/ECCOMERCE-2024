import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    // order_id: {
    //     type: String,
    //     required: true
    //   },
    //   customer_name: {
    //     type: String,
    //     required: true
    //   },
    //   items: [{
    //     item_name: String,
    //     quantity: Number
    //   }],
    //   total_amount: {
    //     type: Number,
    //     required: true
    //   },
    //   status: {
    //     type: String,
    //     enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], // Example status options
    //     default: 'Pending'
    //   }

products:[{
    type:mongoose.ObjectId,
    ref:"Product"
}],
payment:{},
buyer:{
    type:mongoose.ObjectId,
    ref:'User'
},

status:{
    type:String,
    default:"Not Process",
    enum:["Not Process","Processing","Shipped","Delivered","Cancel"]
}
},{
timestamps:true
})

export default mongoose.model('Order',orderSchema)