const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });


class mailOptions {
    constructor(name, email, link){
        this.from= 'Vinayvin34k7@gmail.com',
        this.to= email,
        this.subject= 'Reset your password ! RBIGS',
        this.html= `
        <h3>Reward Based Intelligent Garbage System</h3>
        <h4>Hello ${name}...</h4>
        <p>Please <a href=${link}>click here</a> to reset your password</p>
        <p>This link is vaild only for 30 min</p>
        `
    }
}


const sendMail = (mail)=> {
  return new Promise((resolve, reject) => {
  transporter.sendMail(mail, function(err, data) {
    if (err) {
      reject(err);
    } else {
      resolve(data.response);
    }
    });
})};

module.exports.transporter = transporter; 
module.exports.mailOptions = mailOptions;
module.exports.sendMail = sendMail;