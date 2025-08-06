const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send-email', (req, res) => {
  const { firstName, phone, email, company, additionalInfo } = req.body;

    const ipAddress =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket?.remoteAddress ||
    'IP not available';
  
  const mailOptions = {
    from: email,
    to: 'info@expodite.in',
    subject: 'New Contact Form Submission',
    text:
      `First Name: ${firstName}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Company Name: ${company}\n` +
      `Additional Information: ${additionalInfo || 'N/A'}\n`+
      `Public-IPAddress :${ipAddress}\n`+
      `utm_campaign : ${req.body.utm_campaign??''}\n`+
      `utm_source:${req.body.utm_source??''}\n`+
      `utm_term:${req.body.utm_term??''}`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('success');
    }
  });
});


app.get('/',(req,res)=>{
  res.send("hello user")
})


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

 



