const multer = require('multer')

const storage = multer.diskStorage({
    destination:function (req,file,cb){
        cb(null,'../public/assets/uploads')
    },
    filename:function (req,file,cb){
        const uniqueSuffix =Date.now()
        const myfilename = file.originalname.split('.').pop()

        cb(null,uniqueSuffix + file.fieldname + "." + myfilename)
    }
})

const upload = multer({storage:storage});

module.exports = upload