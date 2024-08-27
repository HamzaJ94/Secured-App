require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const fs = require('fs');
const https = require('https');
const path = require('path');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

const app = express();

// Middleware to enhance security by setting various HTTP headers
app.use(helmet());
app.use(cookieParser());

// Initialize CSRF protection
app.use(csurf({ cookie: { httpOnly: true, secure: true, sameSite: 'Strict' } }));

// Serve the CSRF token to the client
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Content Security Policy (CSP) configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.example.com", "https://apis.google.com"], // Adjust according to your needs
      styleSrc: ["'self'", "https://fonts.googleapis.com"], // Example for Google Fonts
      imgSrc: ["'self'", "https://images.example.com"], // Adjust according to your needs
      connectSrc: ["'self'", "https://api.example.com", "https://identitytoolkit.googleapis.com","https://securetoken.googleapis.com",  // Allow Firebase Token Service
        "https://firebasestorage.googleapis.com" ], // Example for API
      fontSrc: ["'self'", "https://fonts.gstatic.com"], // Google Fonts
      frameSrc: [
        "'self'",
        "https://react-app-9b63e.firebaseapp.com", "https://threatmap.checkpoint.com/" // Allow this domain to be framed
      ],
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

// Protected route
app.post('/api/submit', (req, res) => {
  res.send('Data received securely');
});

// HTTP request logging for debugging and monitoring
app.use(morgan('combined'));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../build')));

// Route to set a secure cookie
app.get('/set-cookie', (req, res) => {
  res.cookie('testCookie', 'cookieValue', { httpOnly: true, secure: true, sameSite: 'strict' });
  res.send('Cookie has been set');
});

// Route to get the cookie value
app.get('/get-cookie', (req, res) => {
  const cookie = req.cookies['testCookie'];
  res.send(`Cookie value is: ${cookie}`);
});

app.get('/test', (req, res) => {
  res.send('Test route is working!');
});

// Route to test error handling middleware
app.get('/error-test', (req, res, next) => {
  const err = new Error('This is a test error!');
  next(err);
});

// Catch-all route for serving the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server.',
      error: err.message,
  });
});

// 404 Handling Middleware
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found.' });
});


// HTTPS server configuration
const options = {
  key: fs.readFileSync("/Users/HJ/secure-react-app/ssl/server.key"), 
  cert: fs.readFileSync("/Users/HJ/secure-react-app/ssl/server.cert") 
};

https.createServer(options, app).listen(8443, () => {
  console.log('Server running on https://localhost:8443');
});

