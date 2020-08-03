const fs = require('fs');
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3005
const data = {}
data.table = []

app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', "*");
  // Header for body content to accept
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next()
});

//parse tools for JSON object
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//push locations.json data as JSON string to calling application
app.get('/', (req, res) => {
  const obj = JSON.parse(fs.readFileSync('locations.json', 'utf8'));
  for (var key in obj) {
    for (var innerKey in obj[key]) {
    }
  }
  res.send(obj)
})


//updates local json file with new entry from react app
app.post('/addEntry', function (req, res) {
  fs.writeFile("locations.json", JSON.stringify(req.body), function (err) {
    if (err) throw err;
    console.log('added entry');
  }
  )
}
)


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  const obj = JSON.parse(fs.readFileSync('locations.json', 'utf8'));
})

