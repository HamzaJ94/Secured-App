const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const path = require('path');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

// Middleware to enhance security by setting various HTTP headers
app.use(helmet());

// Content Security Policy (CSP) configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trustedscripts.com"], // Allow scripts from self and trusted sources
      styleSrc: ["'self'", "trustedstyles.com"],  // Allow styles from self and trusted sources
      imgSrc: ["'self'", "trustedimages.com"],    // Allow images from self and trusted sources
      connectSrc: ["'self'", "api.trusted.com"],  // Allow connections to self and trusted APIs
      fontSrc: ["'self'", "fonts.gstatic.com"],   // Allow fonts from self and Google Fonts
      objectSrc: ["'none'"],                      // Block <object>, <embed>, or <applet> elements
      upgradeInsecureRequests: [],                // Forces HTTPS for all resources
    },
  })
);

// Apply various helmet security features
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use(helmet.xssFilter()); // Prevent XSS attacks
app.use(helmet.noSniff()); // Prevent MIME-type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from opening untrusted HTML
app.use(
  helmet.hsts({     // HTTP Strict Transport Security
    maxAge: 31536000, // One year
    includeSubDomains: true, // Apply HSTS to all subdomains
    preload: true, // Request browsers to preload the site in HSTS list
  })
);
app.use(
  helmet.permittedCrossDomainPolicies({
    permittedPolicies: 'none', // Disallow Adobe products from loading any data from your site
  })
);
app.use(
  helmet.referrerPolicy({
    policy: 'no-referrer', // No referrer information will be sent
  })
);
app.use(helmet.dnsPrefetchControl({ allow: false })); // Control browser DNS prefetching to prevent DNS leaks

// Rate limiter to prevent too many requests from the same IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// HTTP request logging for debugging and monitoring
app.use(morgan('combined'));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// HTTPS server configuration
const options = {
  key: fs.readFileSync('path/to/your/key.pem'), // Path to your SSL key
  cert: fs.readFileSync('path/to/your/cert.pem') // Path to your SSL certificate
};

// Create HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log('Server running on https://localhost:443');
});

// Fallback to HTTP server (optional, can be removed if only using HTTPS)
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
