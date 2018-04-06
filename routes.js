// dependencies
const cheerio = require('cheerio');
const request = require('request');
const mongoose = require("mongoose");
const db = require("./models");

// mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/wordbook");

const routes = function(app){

	// word list home page
	app.get('/', function(req, res) {
		request('https://www.merriam-webster.com/news-trend-watch/see-all', function(error, response, html) {
		  var $ = cheerio.load(html);
		  var trendingWords = [];

		  $('.archive-item').each(function(i, element) {
			var word = $(element).find('h5 a').text();
		    var meaning = $(element).find('p a').text();
			var route = word.replace(/ /g, '-');

			var image = $(element).find('img').attr('data-src').replace('//www', 'http://www').replace('@1x', '@2x');
			var link = 'http://www.merriam-webster.com' + $(element).find('a').attr('href');

		    trendingWords.push({
				word: word,
				meaning: meaning,
				image: image,
				route: route,
				link: link
			});
		  });

		  res.render('index', { trendingWords });
		});

	});

	// saved to word list
	app.post('/saved', function(req, res) {
		// console.log(req.body);

		db.Words.find({
			route: req.body.route
		}).then(function(res){
			if (res[0] === undefined) {
				db.Words.create(req.body)
				.then(function(item) {
					console.log(item.route + 'added');
				})
				.catch(function(err) {
					console.log(err);
				});
			} else {
				console.log('Existing item: ' + req.body.route);
			}
		});

	});

	app.get('/all', function(req, res) {
		db.Words.find({}).then(function(data){
			res.json(data);
		});
		  // res.render('index', { trendingWords });
	});

}

module.exports = routes;
