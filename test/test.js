var fs = require("fs");
var should = require("should");
var feed = require("../");
var fat = require("fat");
var Article = require("fat-article");

describe("feed", function(){
	it("should accept URL string", function(done){
		this.timeout(15000);

		fat.reset();
		fat.receipt(feed("http://blog.nodejs.org/feed/"))
		.receipt(function(article){
			article.should.be.instanceof(Article);
			return article;
		})
		.end(function(){
			done();
		});
	});

	it("should accept Array of URL strings", function(done){
		this.timeout(15000);

		fat.reset();
		fat.receipt(feed(["http://developer.apple.com/news/rss/news.rss", "http://blog.nodejs.org/feed/"]))
		.receipt(function(article){
			article.should.be.instanceof(Article);
			return article;
		})
		.end(function(){
			done();
		});
	});

	it("should accept stream", function(done){
		fat.reset();
		var stream = fs.createReadStream("./test/sample.rss");

		fat.receipt(feed(stream))
		.receipt(function(article){
			article.should.be.instanceof(Article);
			return article;
		})
		.end(function(){
			done();
		});
	});
});