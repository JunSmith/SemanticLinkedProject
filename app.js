var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
var port = 8000;

var db = new sqlite3.Database(':memory:');
var crime = JSON.parse(fs.readFileSync('./assets/CJA01_J.json','utf8'));
var poverty = JSON.parse(fs.readFileSync('./assets/SIA15_J.json', 'utf8'));

db.serialize(function() {
  db.run("CREATE TABLE crime ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'crimeType' TEXT, 'y2004' INTEGER, 'y2005' INTEGER, "
    + "'y2006' INTEGER, 'y2007' INTEGER, 'y2008' INTEGER, 'y2009' INTEGER, "
    + "'y2010' INTEGER, 'y2011' INTEGER, 'y2012' INTEGER, 'y2013' INTEGER)");
  var stmt = db.prepare("INSERT INTO crime (crimeType, y2004, y2005, y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013) VALUES "
    + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  crime.forEach(function(fill) {
    stmt.run(fill.crimeType, fill.Y2004, fill.Y2005, fill.Y2006, fill.Y2007,
      fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013);
  });

  db.run("CREATE TABLE poverty ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'education' TEXT, 'category' TEXT, "
    + "'y2004' REAL, 'y2005' REAL, 'y2006' REAL, 'y2007' REAL, 'y2008' REAL, "
    + "'y2009' REAL, 'y2010' REAL, 'y2011' REAL, 'y2012' REAL, 'y2013' REAL)");
  var stmt = db.prepare("INSERT INTO poverty (education, category, y2004, y2005, y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013) VALUES "
    + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    poverty.forEach(function(fill) {
      stmt.run(fill.Education, fill.Category, fill.Y2004, fill.Y2005,
        fill.Y2006, fill.Y2007, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011,
        fill.Y2012, fill.Y2013);
    });

  stmt.finalize();
});

app.get('/', function(req, res){
 res.render('index');
});

 app.post('/', function(req, res) {
   res.writeHead(301, {Location:'localhost:8000/search/011'})
 });

app.get('/allc', function(req, res) {
  db.all("SELECT * FROM crime", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/allp', function(req, res) {
  db.all("SELECT * FROM poverty", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});


app.get('/all', function(req, res) {
  db.all("SELECT * FROM crime FULL OUTER JOIN poverty", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/search/:id', function(req, res) {
  db.all("SELECT * FROM crime WHERE id = " + req.params.crimeType, function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/post', function(req, res) {
  res.writeHead(200, {'content-type': 'text/plain'});
});

app.get('/delete', function(req, res) {
  res.render('delete');
});

app.get('/add', function(req, res) {

});

// app.post('/delete/search', function(req, res) {
//   console.log("/delete/search: \n\trdoTable: " + req.body.rdoTable + "\n\ttxtID: " + req.body.txtId);
//
//   if(req.body.rdoTable == 'crime') {
//     db.all("SELECT * FROM " + req.body.rdoTable + " WHERE crimeType LIKE '%" + req.body.txtId + "%'", function(err, row) {
//       rowString = JSON.stringify(row, null, '\t');
//       //console.log(rowString.length);
//       res.status(rowString).send(rowString);
//       //res.render('delete-search', {searchRes : rowString});
//     });
//   }
//
//   else {
//     db.all("SELECT * FROM " + req.body.rdoTable + " WHERE education LIKE '%" + req.body.txtId + "%' OR category LIKE '%" + req.body.txtId + "%'", function(err, row) {
//       rowString = JSON.stringify(row, null, '\t');
//       res.sendStatus(rowString);
//     });
//   }
// });

app.post('/delete/search', function(req, res) {
  console.log("/delete/search: \n\trdoTable: " + req.body.rdoTable + "\n\ttxtID: " + req.body.txtId);

  if(req.body.rdoTable == 'crime') {
    db.all("DELETE FROM " + req.body.rdoTable + " WHERE id = " + req.body.txtId);
  }

  else {
    db.all("SELECT * FROM " + req.body.rdoTable + " WHERE education LIKE '%" + req.body.txtId + "%' OR category LIKE '%" + req.body.txtId + "%'", function(err, row) {
      rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
  }
});

var server = app.listen(port);
