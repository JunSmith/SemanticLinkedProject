var crimeJson = require('./CJA01_J.json');
var povJson = require('./SIA15_J.json');
var PouchDB = require('pouchdb');
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');

var app = express();
var getQuery = '0111 ,Murder';
var port = 8000;
var crimeDb = new PouchDB('crimeDb');
var povDb = new PouchDB('povDb');
var crime = JSON.parse(fs.readFileSync('CJA01_J.json', 'utf8'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var server = app.listen(port);

checkDbExists('crimeDb');
checkDbExists('povDb');

function checkDbExists(db){
  try {
    stats = fs.lstatSync('./' + db); // Check if directory exists
    if(stats.isDirectory()) { // true case
      console.log(db, 'directory exists');
    }
  }
  catch(e){ // If directory does not exist
    fillDb(db);
  }
}

function createDb(db)
{
  console.log('Executing fillDb');

  for(var i = 0; i < crimeJson.length; i++) {
    var dbKey = crimeJson[i]._id;
    var dbElements = crimeJson[i];
    delete dbElements._id;

    //console.log(crimeJson[i]._id);

    crimeDb.put({_id:dbKey, dbElements
    }).then(function (response) {
      console.log(response);
    }).catch(function (err){
      console.log(err);
    });
  }

  // for(var i = 0; i < crime.length; i++) {
  //   crimeDb.put({_id:crime[i]._id,
  //   2004:crime[i].2004,
  //   '2005':crime[i].2005,
  //   '2006':crime[i].2006,
  //   '2007':crime[i].2007,
  //   '2008':crime[i].2008,
  //   '2009':crime[i].2009,
  //   '2010':crime[i].2010,
  //   '2011':crime[i].2011,
  //   '2012':crime[i].2012,
  //   '2013':crime[i].2013}).then(function(res){
  //     console.log(res);
  //   }).catch(function(err) {
  //     console.log(err);
  //   });
  // }
}

function getter(query) {
  crimeDb.get(query).then(function (doc) {
    return(doc);
    //return crimeDb.remove(doc);
  }).catch(function (err) {
    return err;
  });
}


console.log(getter('0111 ,Murder'));
console.log(crimeDb.get('0111 ,Murder'));

// function getAll() {
//   crimeDb.allDocs({include_docs:true}, function(err, res) {
//     for(var i = 0;i < res.rows.length; i++) {
//     }
//   }).then(function (res){
//     console.log(res);
//   });
// }
//
// app.get('/', function(req, res) {
//   //var output = JSON.stringify(get(getQuery));
//   //console.log(get(getQuery));
//   res.send(crimeDb.get(getQuery));
// });
//

//
// console.log(crimeDb.get(getQuery));
