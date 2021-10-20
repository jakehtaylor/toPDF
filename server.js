const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
var cors = require('cors');
const dotenv = require('dotenv')

dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use( express.static( "public" ) );

const middlewares = [
    express.static(path.join(__dirname, 'public')),
    bodyParser.urlencoded({ extended: true }),
  ];
  app.use(middlewares);
  const fs = require('fs');

  app.get('/', (req, res) => {
    var file = fs.readFileSync('data.json');
    var parsed = JSON.parse(file);
    var string = JSON.stringify(parsed);
    res.render('index', {data: string});
 });

  app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
  });
  
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });
  
  app.listen(process.env.PORT || 3000, function() {
    console.log("Server Started Successfully")
  });