const express = require('express')
const cors    = require('cors')
const fs = require('fs');
const path = require('path');

// Define the directory path
const uploadDir = path.join(__dirname, '../public/assets/uploads');

// Ensure the directory exists
fs.mkdirSync(uploadDir, { recursive: true });
const app = express()


require('dotenv').config()



app.use(express.json())
app.use(express.static('public'))


// app.use(cookieParser)
app.use(cors({
   origin: 'https://localhost:3000',
   methods:['GET','POST','PUT','DELETE','PATCH'],
   allowedHeaders: 'Content-Type,Authorization',
}))

//auth route
const ar = require('./routes/api/auth.route')
app.use('/api/auth',ar)


//admin router
const adminroute = require('./routes/api/admin.route')
app.use('/api/admin',adminroute)

//category router
const cr = require('./routes/api/common.route')
app.use('/api/admin',cr)

const dr       = require('./routes/api/driver.route')
app.use('/api/admin',dr)

const adr      = require('./routes/api/authdriver.route')
app.use('/api/auth/driver',adr)

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/bimo_operationalPT")


app.get('/' , (req , res)=>{

   res.send('hello from simple server :)')

})


app.listen(process.env.PORT , ()=> console.log('> Server is up and running on port : ' + process.env.PORT))