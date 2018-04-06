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
			var image = $(element).find('img').attr('data-src').replace('//www', 'http://www').replace('@1x', '@2x');
			var link = 'http://www.merriam-webster.com' + $(element).find('a').attr('href');

			var route = word.replace(/ /g, '-');

			var item = {
				word: word,
				meaning: meaning,
				image: image,
				route: route,
				link: link
			}

			db.Words.find({
				word: word
			}).then(function(res){
				if (res[0] === undefined) {
					db.Words.create(item)
					.then(function(item) {
						console.log(item.word);
					})
					.catch(function(err) {
						console.log(err);
					});
				}
			});

		    trendingWords.push(item);
		  });

		  res.render('index', { trendingWords });
		});

	});

	// saved to word list
	app.post('/saved', function(req, res) {
		res.json(req.body);
		console.log(req.body);
	});

	app.get('/all', function(req, res) {
		  // res.render('index', { trendingWords });
	});

}

module.exports = routes;
