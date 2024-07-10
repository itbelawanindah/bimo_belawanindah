const mongoose = require('mongoose')

const requestorderSchema = new mongoose.Schema({
    
    customer_id: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
    
    driver_id: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Driver',
        required:true
    }],
    items_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        required:true
    }],
    pickup_lat:{
        type:String,
        required:false
    },
    pickup_long:{
        type:String,
        required:false
    },
    origin:{
        type:String,
        required:false
    },
    drop_lat:{
        type:String,
        required:false
    },
    drop_long:{
        type:String,
        required:false
    },
    destination:{
        type:String,
        required:false
    },
    pickup_date:{
        type:Date,
        required:false
    },
    description:{
        type:String,
        required:false
    },
    est_sub_total:{
        type:Number,
        required:false
    },
    est_vat:{
        type:Number,
        required:false
    },
    est_grand_total:{
        type:Number,
        required:false
    },
    PriorityStatus: {
        type: String,
        required: false,
        trim: true,
        unique: false,
        lowercase: true,
    },

    PaymentStatus: {
        type: String,
        required: false,
        trim: true,
        unique: false,
        lowercase: true,
    },

    OrderStatus: {
        type: String,
        required: false,
        trim: true,
        unique: false,
        lowercase: true,
    },
    service_id:{
        type:String,
        required:false
    },
    payment_id:{
        type:String,
        required:false
    },
    est_total_distance:{
        type:Number,
        required:false
    },
    est_duration:{
        type:Number,
        required:false
    },
    
    is_active:{
        type:String,
        required:false
    },
    
    status:{
        type:String,
        required:false
    },
    
    cancel_at: {
        type: Date,
        required: false,
    },
    
    created_at: {
        type: Date,
        required: false,
    },

    updated_at: {
        type: Date,
        required: false,
    },

    deleted_at: {
        type: Date,
        required: false,
    },

    
})

module.exports = mongoose.model('requestorder', requestorderSchema)