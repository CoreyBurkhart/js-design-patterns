const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 8080;
let app = express();

app.use(express.static(__dirname + '/src'))

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index');
});

app.listen(PORT, function() {
  console.log('Server is running!');
})
