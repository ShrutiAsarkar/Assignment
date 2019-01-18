"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class EmailController {
    async sendEmail(receivers, body) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 465,
            secure: true,
            auth: {
                user: "apikey",
                pass: "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"
            }
        });
        // setup email data with unicode symbols
        let mailOptions = {
            from: 'hello@payrollchain.com',
            to: receivers,
            subject: 'Uphold Invitation ✔',
            // text: '', // plain text body
            html: body // html body
        };
        // send mail with defined transport object
        let sendMail = await transporter.sendMail(mailOptions, (error, info) => {
            return { error, info };
            // console.log('Message sent: %s', info.messageId);
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        return sendMail;
    }
}
exports.default = EmailController;
