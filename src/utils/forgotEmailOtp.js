const nodemailer = require('nodemailer');
const template = require('../templates/forgotPasswordOtp')


module.exports.forgotEmailOtp = async function (email, code, name) {
  // for use of template 
  let templateHtml = template.forgotEmailOtpTemplate(code,name)

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'shubhammandloi.ems@gmail.com',
      pass: 'guneotzyypycrtpj',
    }
  });

  let mailOptions = {
    from: 'pitchgooglid@gmail.com',
    to: email,
    subject: 'This Mail Is Form Curd Api Project',
    html: templateHtml
    // html: ` Welcome ${name} To Our Crud App <br>
    //       And This Is Your Link For Forgot Your Password <br>
    //   Link :-<a href= "${link}"><b style=" font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #280567;">Please Click On This link...</b></a>` 
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error " + err);
    } else {
      console.log("Email sent successfully");
    }
  });
}
//enable less security app in google 
//link is this : https://www.google.com/settings/security/lesssecureapps