// dependencies
const cheerio = require('cheerio');
const request = require('request');
const mongoose = require("mongoose");
const db = require("./models");

mongoose.connect("mongodb://localhost/wordbook");

const routes = function(app){

	// load all words from db
	app.get('/', function(req, res) {
		db.Words.find({}).then(function(trendingWords){
			res.render('index', { trendingWords });
		}).catch(function(err) {
			console.log(err);
		});
	});

	// view saved
	app.get('/notebook', function(req, res) {
		db.Words.find({
			saved: true
		}).then(function (savedWords){
			res.render('notebook', { savedWords });
		}).catch(function(err) {
			console.log(err);
		});
	});

	// scrape and add to db
	app.get('/api/scrape', function(req, res) {
		request('https://www.merriam-webster.com/news-trend-watch/see-all', function(error, response, html) {
			var $ = cheerio.load(html);
			var trendingWords = [];

			$('.archive-item').each(function(i, element) {

				var newWord = {
					word: $(element).find('h5 a').text(),
					meaning: $(element).find('p a').text(),
					image: $(element).find('img').attr('data-src').replace('//www', 'http://www').replace('@1x', '@2x'),
					route: $(element).find('h5 a').text().replace(/[^\w\s]/gi, '').replace(/ /g, '-'),
					link: 'http://www.merriam-webster.com' + $(element).find('a').attr('href'),
					saved: false
				}

				db.Words.find({
					route: newWord.route
				}).then(function(res){
					if (res[0] === undefined) {
						trendingWords.push(newWord);

						db.Words.create(newWord)
						.then(function() {
							console.log(newWord.route + ' added');
						})
						.catch(function(err) {
							console.log(err);
						});
					}
				});
			});

			res.json(trendingWords);
		});
	});

	// add to notebook
	app.post('/api/save', function(req, res){
		db.Words.update({
			route: req.body.route
		}, {
			$set: { saved: true }
		}).then(function (item){
			console.log(item);
		}).catch(function(err) {
			console.log(err);
		});
	});

	// unsave
	app.post('/api/unsave', function(req, res){
		db.Words.update({
			route: req.body.route
		}, {
			$set: { saved: false }
		}).then(function (item){
			console.log(item);
		}).catch(function(err) {
			console.log(err);
		});
	});

}

module.exports = routes;
