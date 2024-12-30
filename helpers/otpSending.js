const nodemailer = require('nodemailer')


const optSending = async (email, otp) => {


    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for account verification',
            html: `Your otp for account verification is ${otp}`
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error)
                return error
        })

    }
    catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = optSending