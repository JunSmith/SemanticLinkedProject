var crimeJson = require('./CJA01_J.json');
var PouchDB = require('pouchdb');

//var cdb = new pouchdb('http://localhost:8000/cdb'); // crime database
var db = new PouchDB('dbname');

function loader()
{
db.put({
  _id: 'mydoc',
  title: 'Heroes'
}).then(function (response) {
  // handle response
}).catch(function (err) {
  console.log(err);
});

for(var i = 0; i < crimeJson.length; i++)
{
  var dbKey = crimeJson[i]._id;
  var dbElements = crimeJson[i];

  delete dbElements._id;

  cdb.put({
      _id: dbKey,
      dbElements
    }).catch(error){
      console.log(function (err){console.log(err);});
    };
}
}

function getter()
{
db.get('mydoc').then(function (doc) {
  console.log(doc);
}).catch(function (err) {
  console.log(err);
});


}

putter();
getter();
