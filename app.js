var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));

var db = new sqlite3.Database(':memory:');
var crime = JSON.parse(fs.readFileSync('CJA01_J.json','utf8'));
var poverty = JSON.parse(fs.readFileSync('SIA15_J.json', 'utf8'));

db.serialize(function() {
  db.run("CREATE TABLE crime ('id' TEXT, 'y2004' INTEGER, 'y2005' INTEGER, "
    + "'y2006' INTEGER, 'y2007' INTEGER, 'y2008' INTEGER, 'y2009' INTEGER, "
    + "'y2010' INTEGER, 'y2011' INTEGER, 'y2012' INTEGER, 'y2013' INTEGER)");
  var stmt = db.prepare("INSERT INTO crime VALUES "
    + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  crime.forEach(function(fill) {
    stmt.run(fill._id, fill.Y2004, fill.Y2005, fill.Y2006, fill.Y2007,
      fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013);
  });

  db.run("CREATE TABLE poverty ('education' TEXT, 'category' TEXT, "
    + "'y2004' REAL, 'y2005' REAL, 'y2006' REAL, 'y2007' REAL, 'y2008' REAL, "
    + "'y2009' REAL, 'y2010' REAL, 'y2011' REAL, 'y2012' REAL, 'y2013' REAL)");
  var stmt = db.prepare("INSERT INTO poverty VALUES "
    + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    poverty.forEach(function(fill) {
      stmt.run(fill.Education, fill.Category, fill.Y2004, fill.Y2005,
        fill.Y2006, fill.Y2007, fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011,
        fill.Y2012, fill.Y2013);
    });

  stmt.finalize();
});

app.get('/allc', function(req, res){
  db.all("SELECT * FROM crime", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/allp', function(req, res){
  db.all("SELECT * FROM poverty", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/search/:id', function(req, res) {
  db.all("SELECT * FROM crime WHERE id LIKE '%" + req.params.id +"%'", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});
var server = app.listen(8000);
