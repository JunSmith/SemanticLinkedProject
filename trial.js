var crimeJson = require('./CJA01_J.json');
var PouchDB = require('pouchdb');
var express = require('express');
var fs = require('fs');

var app = express();
var getQuery = "0111 ,Murder";
var crimedb = new PouchDB('crimeDb');

function loader()
{
  for(var i = 0; i < crimeJson.length; i++) {
    var dbKey = crimeJson[i]._id;
    var dbElements = crimeJson[i];
    delete dbElements._id;

    crimedb.put({
      _id:dbKey,
      dbElements
    }).then( function (response) {
      console.log(response);
    }).catch(function (err){
      console.log(err);
    });
  }
}

function getter(query) {
  crimedb.get(query).then(function (doc) {
    console.log(doc.dbElements);
    //return crimedb.remove(doc);
  }).catch(function (err) {
    console.log(err);
  });
}

function getAll() {
  crimedb.allDocs({include_docs:true}, function(err, res) {
    for(var i = 0;i < res.rows.length; i++) {
    }
  });
}

app.get('/', function(req, res) {
  res.send(getter(getQuery));
});

function checkDbExists(db){
  try {
    stats = fs.lstatSync('./' + db); // Check if directory exists
    if(stats.isDirectory()) { // true case
      console.log(db, ' directory exists');
    }
  }
  catch(e){ // If directory does not exist
    //loader();
  }
}

checkDbExists('crimeDb');
//loader();
getter(getQuery);
//getAll();

var server = app.listen(8000);
