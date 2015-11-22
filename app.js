// Declarations to use Node.js modules
var sqlite3 = require('sqlite3').verbose();
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

// To use express in this application
var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
var port = 8000;

// Create new sqlite3 database
var db = new sqlite3.Database(':memory:');
var crime = JSON.parse(fs.readFileSync('./assets/CJA01_J.json','utf8'));
var poverty = JSON.parse(fs.readFileSync('./assets/SIA15_J.json', 'utf8'));

// Create table named crime
db.serialize(function() {
  db.run("CREATE TABLE crime ('id' INTEGER PRIMARY KEY AUTOINCREMENT, 'crimeType' TEXT, 'y2004' INTEGER, 'y2005' INTEGER, "
    + "'y2006' INTEGER, 'y2007' INTEGER, 'y2008' INTEGER, 'y2009' INTEGER, "
    + "'y2010' INTEGER, 'y2011' INTEGER, 'y2012' INTEGER, 'y2013' INTEGER)");
  var stmt = db.prepare("INSERT INTO crime (crimeType, y2004, y2005, y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013) VALUES "
    + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  // Read from parsed version of crime dataset, filling table on each pass of reading a JSON object
  crime.forEach(function(fill) {
    stmt.run(fill.crimeType, fill.Y2004, fill.Y2005, fill.Y2006, fill.Y2007,
      fill.Y2008, fill.Y2009, fill.Y2010, fill.Y2011, fill.Y2012, fill.Y2013);
  });

// Same as above, but for the poverty table
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

  // Delete prepared statement
  stmt.finalize();
});

// Home page - putting url alone in address bar will return index.ejs
app.get('/', function(req, res){
 res.render('index.ejs');
});

// url:port/allc queries database to get all records from crime table
app.get('/allc', function(req, res) {
  db.all("SELECT * FROM crime", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//url:port//allp
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
  res.render('post.ejs');
});

app.post('/post/confirm', function(req, res) {
  var elementArr;

  if(req.body.btnFormSub == 'Submit Crime Entry') {
      console.log("Crime was pressed");
      elementArr = [req.body.crimeType, req.body.y2004, req.body.y2005,
        req.body.y2006, req.body.y2007, req.body.y2008, req.body.y2009,
        req.body.y2010, req.body.y2011, req.body.y2012, req.body.y2013];

        var stmt = db.prepare("INSERT INTO crime (crimeType, y2004, y2005, "
          + "y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013) VALUES "
          + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        stmt.run(elementArr[0], elementArr[1], elementArr[2], elementArr[3],
          elementArr[4], elementArr[5], elementArr[6], elementArr[7],
          elementArr[8], elementArr[9], elementArr[10]);
        console.log(elementArr);

        db.all("SELECT * FROM crime", function(err, row) {
          rowString = JSON.stringify(row, null, '\t');
          res.sendStatus(rowString);
        });
  }

  else if(req.body.btnFormSub == 'Submit Poverty Entry') {
    console.log("Poverty was pressed");

    elementArr = [req.body.category, req.body.education, req.body.y2004,
      req.body.y2005, req.body.y2006, req.body.y2007, req.body.y2008,
      req.body.y2009, req.body.y2010, req.body.y2011, req.body.y2012,
      req.body.y2013];

    var stmt = db.prepare("INSERT INTO poverty (education, category, y2004, "
      + "y2005, y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013) VALUES "
      + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    stmt.run(elementArr[0], elementArr[1], elementArr[2], elementArr[3],
      elementArr[4], elementArr[5], elementArr[6], elementArr[7],
      elementArr[8], elementArr[9], elementArr[10], elementArr[11]);

    db.all("SELECT * FROM poverty", function(err, row) {
      rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
  }

  stmt.finalize();
});

app.get('/delete', function(req, res) {
  res.render('delete.ejs');
});

app.post('/delete/search', function(req, res) {
  console.log("/delete/search: \n\trdoTable: " + req.body.rdoTable + "\n\ttxtID: " + req.body.txtId);

  db.all("DELETE FROM " + req.body.rdoTable + " WHERE id = " + req.body.txtId);
  db.all("SELECT * FROM " + req.body.rdoTable, function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/update', function(req, res) {

});

var server = app.listen(port);
