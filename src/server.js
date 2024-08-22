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
      scriptSrc: ["'self'", "https://cdn.example.com"], // Adjust according to your needs
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Example for Google Fonts
      imgSrc: ["'self'", "https://images.example.com"], // Adjust according to your needs
      connectSrc: ["'self'", "https://api.example.com"], // Example for API
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Google Fonts
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [], // Forces HTTPS for all resources
    },
  })
);

// Apply various helmet security features
app.use(helmet.frameguard({ action: 'deny' })); // Prevent clickjacking
app.use(helmet.xssFilter()); // Prevent XSS attacks
app.use(helmet.noSniff()); // Prevent MIME-type sniffing
app.use(helmet.ieNoOpen()); // Prevent IE from opening untrusted HTML
app.use(helmet.hidePoweredBy()); // Prevent server from disclosing its technology stack via the ``X-Powered-by` header
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
  key: fs.readFileSync(process.env.SSL_KEY_PATH), // Path to your SSL key
  cert: fs.readFileSync(process.env.SSL_CERT_PATH) // Path to your SSL certificate
};

// Create HTTPS server
https.createServer(options, app).listen(443, () => {
  console.log('Server running on https://localhost:443');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Logs the error stack trace to the console
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong on the server.',
    error: err.message, // Include error message in response for debugging
  });
});

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found.' });
});

