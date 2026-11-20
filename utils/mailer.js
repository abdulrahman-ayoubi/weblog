const nodemailer = require("nodemailer");
const mailerTransport = require("nodemailer-smtp-transport");

const transportDetail = mailerTransport({
    host: "abdulrahmanafg1234@gmail.com",
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized: false
    }
})


exports.sendEmail = async (email, fullName, subject, message) => {
    const transport = nodemailer.createTransport(transportDetail);
    await transport.sendMail({
        from: "abdulrahmanafg1234@gmail.com",
        to: email,
        subject,
        html: `<h1>Hi${fullName}</h1>
            <p>${message}</p>`
    })
}