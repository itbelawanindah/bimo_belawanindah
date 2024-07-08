const mongoose = require('mongoose')


const permissionSchema = new mongoose.Schema({
    permission_name:{
        type:String,
        required:true,
    },
    is_default:{
        type:Number,
        default:0 //0-> default ,1->default
    }
})

module.exports = mongoose.model('Permission',permissionSchema)