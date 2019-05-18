const nodemailer = require("nodemailer")

// async..await is not allowed in global scope, must use a wrapper
var sendEmail = async (receiver, subject, data) => {

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  console.log(data)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Appointment Mangement Team" <app@123.com>', // sender address
    to: receiver, // list of receivers
    subject: subject, // Subject line
    html: "<p>Customer name: Tom Hanks</p>"
    		+ "<p>Number: +1234567789</p>"
    		+ "<p>Email: 123@test.com</p>"
    		+ "<p>Time: 10:00-12:00 20-5-2019</p>"
    		+ "<p>Message: some optional message</p>" 
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//nodemailer().catch(console.error);


sendEmail("hww2@student.unimelb.edu.au", "Appointment Reservation", {})

module.exports = {
	sendEmail: sendEmail
}