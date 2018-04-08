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

	// scrape and add to db
	app.get('/scrape', function(req, res) {
		request('https://www.merriam-webster.com/news-trend-watch/see-all', function(error, response, html) {
			var $ = cheerio.load(html);
			var trendingWords = [];

			$('.archive-item').each(function(i, element) {

				var newWord = {
					word: $(element).find('h5 a').text(),
					meaning: $(element).find('p a').text(),
					image: $(element).find('img').attr('data-src').replace('//www', 'http://www').replace('@1x', '@2x'),
					saved: false
				}

				db.Words.find({
					word: newWord.word
				}).then(function(res){
					if (res[0] === undefined) {
						trendingWords.push(newWord);

						db.Words.create(newWord)
						.then(function() {
							console.log(newWord.word);
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

	// view saved
	app.get('/notebook', function(req, res) {
		db.Words.find({
			saved: true
		}).then(function (savedWords){
			res.render('notebook', { savedWords });
		}).catch(function(err) {
			res.json(err);
		});
	});

	// save and unsave
	app.post('/word/:_id', function(req, res){
		db.Words.update({
			_id: req.params._id
		}, {
			$set: { saved: req.body.saved }
		}).then(function (item){
			res.json(item);
		}).catch(function(err) {
			res.json(err);
		});
	});

	app.get('/word/:_id', function(req, res){
		db.Words.findOne({
			_id: req.params._id
		}).populate('notes')
		.then(function (data){
			res.json(data);
		}).catch(function(err) {
			res.json(err);
		});
	});

	// add note
	app.post('/add', function(req, res){

		db.Notes.create({
			text: req.body.text
		})
		.then(function(item) {
			db.Words.update(
				{ _id: req.body._id
				}, { $push: { notes: item._id }
				}, { new: true }
			).catch(function(err) {
				res.json(err);
			});
		}).catch(function(err) {
			res.json(err);
		});

		res.end();
	});

	// show note
	app.get('/note/:_id', function(req, res) {
		db.Notes.findOne({
			_id: req.params._id
		}).then(function (note){
			res.json(note);
		}).catch(function(err) {
			res.json(err);
		});
	});

	// delete note
	app.post('/delete', function(req, res) {
		db.Notes.deleteOne({
			_id: req.body._id
		}).then(function(data) {
			res.json(data);
		});
	});

}
module.exports = routes;
