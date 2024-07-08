const mongoose = require('mongoose')


const routerpermissionSchema = new mongoose.Schema({
    router_endpoint:{
        type:String,
        required:true,
    },
    role:{ //0,1,2,3
        type:Number,
        default:0 //0-> default ,1->default
    },
    permission_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Permission"
    },
    permission:{
        type:Array, //0,1,2,3
        required:true
    }
})

module.exports = mongoose.model('RouterPermission',routerpermissionSchema)