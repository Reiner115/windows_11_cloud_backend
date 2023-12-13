const logger = require("./util/logger");
const express = require("express");
const fs = require("fs");
var cors = require("cors");
const app = express();
const nodemailer = require('nodemailer');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use("/", require("./routes"));

var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync("./localhost.key", "utf8");
var certificate = fs.readFileSync("./localhost.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.WINDOWS_CLOUD_HTTP_PORT || 8000, () => {
  logger.info("listining http at port  " + (process.env.WINDOWS_CLOUD_HTTP_PORT ));
});
httpsServer.listen(process.env.WINDOWS_CLOUD_HTTPS_PORT|| 9000, () => {
  logger.info("listining HTTPS at port  " + (process.env.WINDOWS_CLOUD_HTTPS_PORT));
});

const os = require('os');
const platform = os.platform();
logger.info("OS type :: "+platform);

/*
const transporter = nodemailer.createTransport({
  host: 'mail.mohamed-adam.com', // Replace with your SMTP server hostname
  port: 465, // Replace with your SMTP port
  secure: true, // Set to true if your SMTP server requires a secure connection (e.g., port 465)
  auth: {
    user: 'dev@mohamed-adam.com', // Your email address
    pass: 'Mohamed199765432', // Your email password
  },
  
});
const htmlContent = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
      }
      h1 {
        color: #333;
      }
    </style>
  </head>
  <body>
    <h1>Welcome to My Email</h1>
    <p>This is a styled email content.</p>
  </body>
  </html>
`;
const mailOptions = {
  from: 'Mohamed Adam',
  to: "mohamedadamza@gmail.com",
  subject: 'Activate Your Account',
  text: `Hi there , i am Mohamed Adam , a software developer`,
  htmlContent : htmlContent
};

 transporter.sendMail(mailOptions).then(value=>console.log(value)).catch(err=>console.log(err));
 */