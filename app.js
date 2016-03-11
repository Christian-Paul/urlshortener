var express = require('express');
var app = express();
var mongoose = require('mongoose');

app.enable('trust proxy');
var port = process.env.PORT || 3000;

// mongoose initialization
mongoose.connect('mongodb://christ:please@ds064748.mlab.com:64748/addressbook');
var db = mongoose.connection;
var urlSchema = new mongoose.Schema({
    id: Number,
    longurl: String
});
var Url = mongoose.model('Url', urlSchema);

app.get('/new/*', function(req, res) { 
    
    var longurl = req.originalUrl.split('/new/')[1];
    var valid = /^(ftp|http|https):\/\/[^ "]+$/;

    // validates url, if fails, send json error object
    if(!valid.test(longurl)) {
        res.json({ error: 'improper url format' });
    }
    else {
        Url.count({}, function(err, item) {
            // count the number of documents in the collection
            var count = item;
            
            // makes a new document with id number = # of docs
            // and longurl = url user just entered
            var newurl = new Url({
                id: count,
                longurl: longurl
            });
            
            // save document
            newurl.save(function(err) {
                if(err) {
                    console.log('error');
                }
                else {
                    console.log('success!');
                }
            });

            // for development on localhost:port
            //res.json({ longurl: longurl, shorturl: req.hostname + ':' + port + '/' + count });

            // for deployment
            res.json({ longurl: longurl, shorturl: req.hostname + '/' + count });
        });
    }
});

// these are the paths corresponding to shortened urls
app.get('/:id', function(req, res) {
    
    // find a document whose id matches the url :id
    Url.findOne({ id: req.params.id }, function(err, item) {
        if(err) {
            return console.log(err);
        }
        // redirect to that document's longurl link
        else {
            res.redirect(item.longurl)
        }
    });
});

app.listen(port);