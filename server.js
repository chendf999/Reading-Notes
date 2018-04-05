// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var request = require('request');
var path = require("path");
var exphbs = require("express-handlebars");

// express
var app = express();
var PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Static directory
app.use(express.static("./public"));

// handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// routes
app.get("/", function(req, res) {
	request('https://www.merriam-webster.com/news-trend-watch/see-all', function(error, response, html) {
	  var $ = cheerio.load(html);
	  var trendingWords = [];

	  $('.archive-item').each(function(i, element) {
		var word = $(element).find('h5 a').text();
	    var meaning = $(element).find('p a').text();
		var image = $(element).find('img').attr('data-src').replace('//www', 'www').replace('@1x', '@2x');
		var link = 'www.merriam-webster.com' + $(element).find('a').attr('href');

	    trendingWords.push({
	      word: word,
		  meaning: meaning,
		  image: image,
		  link: link
	    });
	  });

	  // console.log(trendingWords);
	  // console.log(trendingWords.length);
	  res.render('index', { trendingWords });
	});

});


app.listen(3000, function() {
  console.log("App running on port 3000!");
});