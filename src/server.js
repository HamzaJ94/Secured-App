const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const path = require('path');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(helmet.hsts({ maxAge: 31536000 }));
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "https://trusted.cdn.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:"],
    connectSrc: ["'self'", "https://api.yourservice.com"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    frameAncestors: ["'none'"],
    upgradeInsecureRequests: []
  }
}));

app.use(helmet());
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use(helmet.xssFilter()); // XSS protection
app.use(helmet.noSniff()); // Prevent MIME-type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from opening untrusted HTML

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const options = {
  key: fs.readFileSync('path/to/your/key.pem'),
  cert: fs.readFileSync('path/to/your/cert.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('Server running on https://localhost:443');
});
