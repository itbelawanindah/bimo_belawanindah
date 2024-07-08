const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 587,
  secure: false, // use SSL
  auth: {
    user: 'itbelawanindah@gmail.com',
    pass: 'elct dicg islj ukrr',
  },
  tls: {
      ciphers:'SSLv3'
  }
})

const sendMail = async(email,subject,content)=>{
    try {
        var mailOptions={
            from:'itbelawanindah@gmail.com',
            to:email,
            subject:subject,
            html:content
        }
        // Send the email
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log( error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
    } catch (error) {
        console.error(error)
    }
}

module.exports ={
    sendMail
}