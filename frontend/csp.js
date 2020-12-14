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
    "https://fonts.googleapis.com"
  ],
  "img-src": [
    "*", 
    "data:"
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
    "blob:"
  ],
  "script-src-elem": ["'self'", "https://imasdk.googleapis.com/"]
  }
}