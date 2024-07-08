const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    item_name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    
    is_active:{
        type:String,
        required:false
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

module.exports = mongoose.model('Item', itemSchema)