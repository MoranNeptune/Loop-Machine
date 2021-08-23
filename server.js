//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/loop-machine'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/loop-machine/index.html'));
});

// Start the app by listening on the default Heroku port
var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || '0.0.0.0';
app.listen(server_port, server_host, function() {
    console.log('Listening on port %d', server_port);
});
