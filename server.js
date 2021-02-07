const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const app = express();

const whitelist = ['http://localhost:3000', 'http://localhost:8000'];
const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  }

app.use(cors());

// Load routes
require('./routes')(app);

module.exports = app;