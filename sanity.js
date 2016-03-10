var express = require('express');
var app = express();
app.enable('trust proxy');

var mongoose = require('mongoose');
mongoose.connect('mongodb://christ:please@ds064748.mlab.com:64748/addressbook');

var db = mongoose.connection;

var urlSchema = new mongoose.Schema({
    id: Number,
    longurl: String
});

var Url = mongoose.model('Url', urlSchema);

var port = process.env.PORT || 3000;

app.get('/new/*', function(req, res) {
    
    var count = 0;
    
    Url.count({}, function(err, item) {
        count = item;
    });
    
    console.log(count + ' items outside');
    
    var longurl = req.originalUrl.split('/new/')[1];
    
    /*longurl doesn't have 'http://www.*.*' || 'https://www.*.*')*/
    if(false) {
        res.json({ error: 'improper url format' });
    }
    
    var newurl = new Url({
        id: count,
        longurl: longurl
    });

    newurl.save(function(err) {
        if(err) {
            console.log('error');
        }
        else {
            console.log('success!')
        }
    });

    
    res.json({ longurl: longurl, shorturl: req.hostname + ':' + port + '/' + count });
});

app.get('/:id', function(req, res) {
    
    Url.findOne({ id: req.params.id }, function(err, item) {
        if(err) {
            return console.log(err);
        }
        else {
            console.log(item);
            console.log(item.longurl);
            res.redirect(item.longurl)
        }
    });
});

app.listen(port);