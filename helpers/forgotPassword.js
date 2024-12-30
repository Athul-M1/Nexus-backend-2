const nodemailer = require('nodemailer')

const passwordSending = async (email, link,username) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Forgot password ",
            html: `<p>Hi ${username}
            To reset the paasword you have to click on this link and change the password ${link}`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error)
                return error
        })
    } catch (error) {
        console.log(error)
        throw error
    }
}

module.exports = passwordSending