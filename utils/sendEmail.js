const nodemailer = require('nodemailer');
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_PROVIDER,
    auth: {
      user: process.env.EMAIL_SERVICE_PROVIDER,
      pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
  });

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    a:hover {
      opacity: 0.9;
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4;">

  <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="margin-top:40px; border-radius: 10px; overflow:hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr bgcolor="#4CAF50">
            <td align="center" style="padding: 30px 20px; color: #ffffff; font-size: 24px; font-weight: bold;">
              To Do App
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px; font-size: 16px; color: #333333; line-height: 1.5;">
              <p>Hello,</p>

              <p>We received a request to reset your password for your To Do App account. your code is below: </p>

              <p style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block;background-color: #4CAF50; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                  ${options.resetCode}
                </span>
              </p>

              <p>If you didn’t request this, you can safely ignore this email.</p>
              <p>Valid for 10 minutes</p>

              <p style="margin-top: 30px;">Thanks,<br>The To Do App Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr bgcolor="#f4f4f4">
            <td style="padding: 20px 30px; font-size: 12px; color: #999999; text-align: center;">
              &copy; 2025 To Do App. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
`;

  const mailOptions = {
    from: 'To Do App',
    to: options.email,
    subject: 'Password Reset Code',
    html: htmlTemplate,
  };

  transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
