var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://chris:please@ds064748.mlab.com:64748/addressbook');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    
    var urlSchema = new mongoose.Schema({
    id: Number,
    longurl: String
    });

    var Url = mongoose.model('Url', urlSchema);
    
});

var port = process.env.PORT || 3000;

var count = 1;

app.get('/new/*', function(req, res) {
    var longurl = req.originalUrl.split('/new/')[1];
    
    var newurl = new Url({
        id: count,
        longurl: longurl
    });
    
    newurl.save(function(err) {
        if(err) {
          console.log('error');  
        }
    });
    
    count++;
    
    res.json({ longurl: longurl, shorturl: count });
});

app.get('/', function(req, res) {
    res.redirect('http://google.com');
});

app.listen(port);