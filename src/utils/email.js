const nodemailer = require('nodemailer')
const config = require('./config')

const sendResetLink = async (email, id) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: config.secrets.emailUser,
            pass: config.secrets.emailPass,
        },
    })

    const mailOptions = {
        from: config.secrets.emailUser,
        to: email,
        subject: 'Reset password instructions',
        text: `To reset your password, please click on this link: http:/localhost/reset/${id}`,
    }

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}
sendResetLink()
module.exports = sendResetLink
