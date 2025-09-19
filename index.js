const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const axios=require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

 app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'info@expodite.in', 
    pass: 'uvka smmq jogm ozwe',
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
    replyTo: email,
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
  res.send("Hello User")
})

 const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbydZKEloPNHBcI9Y69R83_JEVTXzvvc4iIKjGrpTQSAQwOTpdc9pxCtFtQO6dA2Wjfj/exec";
app.post("/utm", async (req, res) => {
     try {
        const { utm_source, utm_medium, utm_campaign, utm_term, utm_content } = req.body;
        
        const timestamp = new Date().toISOString()
        const response = await axios.post(GOOGLE_SHEET_URL, {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_term,
            utm_content,
            timestamp,
        });

        res.json({ success: true, message: "UTM data sent to Google Sheets", googleResponse: response.data });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Error sending data to Google Sheets" });
    }
});



const Google_Sheet="https://script.google.com/macros/s/AKfycby78AWefgKqbJfnan_1qstVod7q3lP0uWImfNYFdev7Q32KxNlP_OHT8oNs_iVlYEUXEg/exec"
app.post("/track-Expodite", async (req, res) => {
  try {
    const data = req.body;
   

    const response = await axios.post(Google_Sheet, data, {
      headers: { "Content-Type": "application/json" },
    });

    res.json({ status: "success", googleResponse: response.data });
  } catch (error) {
    console.error("Error sending to Google Sheets:", error.message);
    res.status(500).json({ status: "error", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

 












