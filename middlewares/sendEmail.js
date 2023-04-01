const nodeMailer = require("nodemailer");

exports.sendEmail = async (options) => {

    // it is use when we use google
    const transporter = nodeMailer.createTransport({
        
        // host: process.env.SMPT_HOST,
        // port: process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,

        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
    });

    // var transporter = nodeMailer.createTransport({
    //     host: "sandbox.smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //       user: "ef2d4ef4c99c52",
    //       pass: "05469cb01ec57a"
    //     }
    //   });

    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

//     transporter.sendMail(mailOptions, function (err, info) {
//    if(err)
//      console.log(err)
//    else
//      console.log(info);
// });
    const response = await transporter.sendMail(mailOptions);
    console.log("Response : ",response)
}