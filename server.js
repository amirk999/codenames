const express = require('express');
const db = require('./db');
const app = express();

// Set up port
const port = process.env.PORT || 3000;

// Load routes
var indexRouter = require('./routes/index');
var cardRouter = require('./routes/card');
var gameRouter = require('./routes/game');

app.use(express.json());
app.use('/', indexRouter);
app.use('/cards', cardRouter);
app.use('/games', gameRouter);

// app.get('/dictionary', (req, res, next) => {
//     db.query('SELECT * FROM dictionary', '', (err, dbres) => {
//         if(err) {
//             return next(err);
//         }
//         res.send(dbres.rows);
//     })
// });


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});