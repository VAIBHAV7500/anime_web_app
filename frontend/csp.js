module.exports = {
  dev: {
  "default-src": ["'self'"],
  "style-src": [
    "'self'",
    "https://*.google.com",
  ]
  },
  prod: {
  "default-src": "'self'",  // can be either a string or an array.
  "style-src": [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com",
    "https://hcaptcha.com",
    "https://*.hcaptcha.com"
  ],
  "img-src": [
    "*", 
    "data:",
    "'self'",
  ],
  "font-src": ["*", "'self'", "https://fonts.gstatic.com", "data:"],
  "worker-src": ["*", "'self'", "blob:"],
  "connect-src": [
    "'self'",
    "https://mybackend.com"
  ],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "blob:",
    "https://hcaptcha.com", 
    "https://*.hcaptcha.com"
  ],
  "frame-src": [
    "'self'",
    "https://hcaptcha.com", 
    "https://*.hcaptcha.com",
  ],
  "script-src-elem": ["'self'", "https://imasdk.googleapis.com/"],
  "connect-src": ["'self'", "https://hcaptcha.com", "https://*.hcaptcha.com"]
  },
}