const mongoose = require('mongoose')

const requestorderSchema = new mongoose.Schema({
    
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
    pickup_address:{
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
    drop_address:{
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
        type:String,
        required:false
    },
    est_duration:{
        type:String,
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
    created_by: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],

    updated_by: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],

    deleted_by: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }],
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