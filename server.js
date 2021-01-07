const express = require('express');
// const db = require('./db/db');
const app = express();

// Set up port
const port = process.env.PORT || 3000;

// Load routes
require('./routes')(app);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});