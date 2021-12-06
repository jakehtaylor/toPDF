const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const readXlsxFile = require('read-excel-file/node')
var cors = require('cors');
const drop = require('./jmgdrop')
const { schema } = require('./schema')
const dotenv = require('dotenv')
const jsPDF = require('jspdf')
const fs = require('fs');
dotenv.config();

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors());
app.use( express.static( "public" ) );

const middlewares = [
    express.static(path.join(__dirname, 'public')),
  ];
app.use(middlewares);
/*
app.use(
  express.urlencoded({
    extended: true
  })
);
*/
app.use(express.json());

  app.get('/', (req, res) => {
    console.log('GET')
    let data = {'objects': []};
    readXlsxFile('public/data.xlsx', { getSheets: true }).then((sheets) => {
      for (s in sheets.slice(0, 1)) {
        readXlsxFile(fs.createReadStream('public/data.xlsx'), {sheet: parseInt(s)+1}).then((rows) => {
          var headers = rows[4].map(function(x){return x.toLowerCase().replace(/\s+/g, "_")})
          for (var j=5; j<rows.length; j++) {
            temp = {}
            for (var i=0; i<rows[j].length; i++) {
              temp[headers[i]] = String(rows[j][i]).replace(/"/g, "'",)
            };
            data.objects.push(temp)
          };
          //drop.download_folder('/JMG Team Folder/zDealer Intelligence Report/Dealer Intelligence Report Icons', 'public/icons')
          res.render('index', {sheet1: JSON.stringify(data), schema: JSON.stringify(schema)});
        });
      }
    });
  });

  app.get('/upload', function(req,res) {
    res.status(200).send('GET 200 OK');
 });

 app.post('/upload', function(req,res) {
  console.log(req.data.string)
  res.send(200)


    //drop.upload_file(data.name, '/JMG Team Folder/zDealer Intelligence Report/' + data.name)

 });

 app.get('/html2canvas.min.js',function(req,res){
    res.sendFile('public/html2canvas.min.js'); 
  });

  app.get('/purify.min.js',function(req,res){
    res.sendFile('public/purify.min.js'); 
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
  