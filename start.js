const app = require('./server');

// Set up port
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});