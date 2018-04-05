var cheerio = require('cheerio');
var request = require('request');

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

  console.log(trendingWords);
  console.log(trendingWords.length);
});