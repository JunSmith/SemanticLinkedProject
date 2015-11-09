var crimeJson = require('./CJA01_J.json');
var PouchDB = require('pouchdb');
var express = require('express');

var app = express();
var cdb = new PouchDB('cdb'); // crime database

// need to get all the ids
//var dbKey = crimeJson[0]._id; // gets value of key _id
//var dbElements = crimeJson[0]; // gets all the values of first crimeJson file

//delete dbElements._id;
//console.log(dbKey, '\n', dbElements);

// TODO use crimeJson.forEach with pouchDb.put in similair fashion (may be better to use standard for as crimeJson[i]._id can be used)

function loadDbs()
{
  for(var i = 0; i < crimeJson.length; i++)
  {
    var dbKey = crimeJson[i]._id;
    var dbElements = crimeJson[i];

    delete dbElements._id;

    cdb.put({
        _id: dbKey,
        dbElements
      });
  }
}

cdb.put(trialData);

app.get('/', function(req, res) {
  //res.send("Welcome to Jun's API - not much going on here yet");
  //res.send(cdb.get("0412 ,Driving/in charge of a vehicle while over legal alcohol limit"));
  res.send(cdb.get('first'));
});

loadDbs();

var server = app.listen(8000);
