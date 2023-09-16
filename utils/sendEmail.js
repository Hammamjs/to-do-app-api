const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_PROVIDER,
    auth: {
      user: process.env.EMAIL_SERVICE_PROVIDER,
      pass: process.env.PASSWORD_SERVICE_PROVIDER,
    },
  });

  const mailOptions = {
    from: "To Do App",
    mail: "todoapp@gmail.com",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
