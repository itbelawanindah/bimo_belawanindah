const mongoose = require('mongoose')


const driverpermissionSchema = new mongoose.Schema({
    driver_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Driver'
    },
    permissions:[
        {
            permission_name:String,
            permission_value:[Number]
        }
    ]
})

module.exports = mongoose.model('DriverPermission',driverpermissionSchema)