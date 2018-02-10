const express = require('express'),
      path = require('path'),
      app = express();

app.use('/static', express.static(path.join(__dirname, 'public')))
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

let serv = app.listen(3000, '127.0.0.1', () => console.log('Example app listening localhost:3000!'));


app.get('/', (req, res) => {
    res.render('index');
})
