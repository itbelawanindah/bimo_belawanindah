const mongoose = require('mongoose')


const userpermissionSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    permissions:[
        {
            permission_name:String,
            permission_value:[Number]
        }
    ]
})

module.exports = mongoose.model('UserPermission',userpermissionSchema)