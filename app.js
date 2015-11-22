// Declarations to use Node.js modules
var sqlite3 = require('sqlite3').verbose(); // Database used
var express = require('express'); // For web hosting
var bodyParser = require('body-parser'); // To read JSON bodies
var fs = require('fs'); // To read files

// To use express in this application
var app = express();
app.set('view engine', 'ejs'); // To be able to read .ejs files
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
var port = 8000; // Port to be used

// Create new sqlite3 database
var db = new sqlite3.Database(':memory:');
var crime = JSON.parse(fs.readFileSync('./assets/datasets/CJA01_J.json','utf8'));
var poverty = JSON.parse(fs.readFileSync('./assets/datasets/SIA15_J.json', 'utf8'));

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

// queries poverty table to get all records from table
app.get('/allp', function(req, res) {
  db.all("SELECT * FROM poverty", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

// gets all records from both tables
app.get('/all', function(req, res) {
  db.all("SELECT * FROM crime FULL OUTER JOIN poverty", function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

// gets record matching secified ID from specified table (e.g. crime/3)
app.get('/search/:table/:id', function(req, res) {
  db.all("SELECT * FROM " + req.params.table + " WHERE id = " + req.params.id,
    function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

// url ending to add to table
app.get('/post', function(req, res) {
  res.render('post.ejs');
});

// Field information from post.ejs handled to insert into appropriate tables
app.post('/post/confirm', function(req, res) {
  var elementArr;

  // True if button below crime entry form is pressed
  if(req.body.btnFormSub == 'Submit Crime Entry') {
      console.log("/post/confirm: btnFormSub Crime Pressed");

      // Array containing information from filled form
      elementArr = [req.body.crimeType, req.body.cy2004, req.body.cy2005,
        req.body.cy2006, req.body.cy2007, req.body.cy2008, req.body.cy2009,
        req.body.cy2010, req.body.cy2011, req.body.cy2012, req.body.cy2013];

        // prepares to insert into crime table
        var stmt = db.prepare("INSERT INTO crime (crimeType, y2004, y2005, "
          + "y2006, y2007, y2008, y2009, y2010, y2011, y2012, y2013) VALUES "
          + "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        // Fills table with form information
        stmt.run(elementArr[0], elementArr[1], elementArr[2], elementArr[3],
          elementArr[4], elementArr[5], elementArr[6], elementArr[7],
          elementArr[8], elementArr[9], elementArr[10]);

        // Displays crime table to show change
        db.all("SELECT * FROM crime", function(err, row) {
          rowString = JSON.stringify(row, null, '\t');
          res.sendStatus(rowString);
        });
  }

  // Same process as above insertion into crime table but with poverty table
  else {
    console.log("/post/confirm: btnFormSub Poverty Pressed");

    elementArr = [req.body.category, req.body.education, req.body.py2004,
      req.body.py2005, req.body.py2006, req.body.py2007, req.body.py2008,
      req.body.py2009, req.body.py2010, req.body.py2011, req.body.py2012,
      req.body.py2013];

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

  console.log(elementArr);
  stmt.finalize();
});

app.get('/delete', function(req, res) {
  res.render('delete.ejs');
});

// post function called by delete.ejs when submit button is clicked
app.post('/delete/search', function(req, res) {
  console.log("/delete/search: \n\trdoTable: " + req.body.rdoTable + "\n\ttxtID: " + req.body.txtId);

  db.all("DELETE FROM " + req.body.rdoTable + " WHERE id = " + req.body.txtId);
  db.all("SELECT * FROM " + req.body.rdoTable, function(err, row) {
    rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/update', function(req, res) {
  res.render('update.ejs');
});

// post function called by update.ejs when submit button is clicked
app.post('/update/confirm', function(req, res) {

  // True if button value is "Update Crime Entry"
  if(req.body.btnFormSub == 'Update Crime Entry') {
    // Updates values from form in update.ejs identified by specified ID named cid
    db.all("UPDATE crime SET crimeType = '" + req.body.crimeType + "', y2004 = "
      + req.body.cy2004 + ", y2005 = " + req.body.cy2005 + ", y2006 = "
      + req.body.cy2006 + ", y2007 = " + req.body.cy2007 + ", y2008 = "
      + req.body.cy2008 + ", y2009 = " + req.body.cy2009 + ", y2010 = "
      + req.body.cy2010 + ", y2011 = " + req.body.cy2011 + ", y2012 = "
      + req.body.cy2012 + ", y2013 = " + req.body.cy2013 + " WHERE id = "
      + req.body.cid);

    // Prints out all entries from crime table
    db.all("SELECT * FROM crime", function(err, row) {
      rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
  }

  // Same process but with the poverty table
  else {
    db.all("UPDATE poverty SET category = '" + req.body.category + "'"
      + ", education = '" + req.body.education + "', y2004 = "
      + req.body.py2004 + ", y2005 = " + req.body.py2005 + ", y2006 = "
      + req.body.py2006 + ", y2007 = " + req.body.py2007 + ", y2008 = "
      + req.body.py2008 + ", y2009 = " + req.body.py2009 + ", y2010 = "
      + req.body.py2010 + ", y2011 = " + req.body.py2011 + ", y2012 = "
      + req.body.py2012 + ", y2013 = " + req.body.py2013 + " WHERE id = "
      + req.body.pid);

    db.all("SELECT * FROM poverty", function(err, row) {
      rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
  }
});

// Listen on specified port
var server = app.listen(port);
