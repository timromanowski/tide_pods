var express = require('express');
var fs = require('fs');
var cheerio = require('cheerio');
var app     = express();
var scraper = require( './util/TideScraper');
var exphbs = require('express-handlebars');
var supportedLocations = require( './data/SupportedLocations' );

app.use(express.static('static'))
app.engine('handlebars',  exphbs({defaultLayout: 'default'}))
app.set('view engine', 'handlebars')
app.set('views', './views')

const PORT = 8080;
const HOST = '0.0.0.0';

app.get('/', function(req, res){

  //All the web scraping magic will happen here
  res.render('index', { locations: supportedLocations });

})

app.get('/:location', function(req, res){

  //All the web scraping magic will happen here
  let s = new scraper();
  let location = supportedLocations.find(x => x.url === req.params.location);
  s.get(location).then((pod) => res.render('tide_pod', { location: location, pod: pod }));
})

app.listen(PORT, HOST);
console.log(`Running Tide Pods http://${HOST}:${PORT}`);

exports = module.exports = app;