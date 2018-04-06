const cheerio = require('cheerio');
const request = require('request');

const routes = function(app){

	// word list home page
	app.get('/', function(req, res) {
		request('https://www.merriam-webster.com/news-trend-watch/see-all', function(error, response, html) {
		  var $ = cheerio.load(html);
		  var trendingWords = [];

		  $('.archive-item').each(function(i, element) {
			var sentence = $(element).find('h5 a').text();
			var word = sentence.split('\'');
		    var meaning = $(element).find('p a').text();
			var image = $(element).find('img').attr('data-src').replace('//www', 'www').replace('@1x', '@2x');
			var link = 'www.merriam-webster.com' + $(element).find('a').attr('href');

		    trendingWords.push({
		      word: word[1],
			  sentence: sentence,
			  meaning: meaning,
			  image: image,
			  link: link
		    });
		  });

		  console.log(trendingWords);
		  res.render('index', { trendingWords });
		});

	});

	// saved to word list
	app.post('/saved', function(req, res) {
		res.json(req.body);
		console.log(req.body);
	});

	app.get('/mywords', function(req, res) {
		  // res.render('index', { trendingWords });
	});

}

module.exports = routes;
