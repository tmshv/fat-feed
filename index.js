var request = require("request");
var FeedParser = require("feedparser");
var Article = require("fat-article");
var Receipt = require("fat").Receipt;

module.exports = function(param){
	var receipt = new Receipt();
	receipt.wrap(function(data, next){
		//this is an instance of Receipt
		var self = this;

		var nnn = function(error, data){
			if(error){
				next();
			}else{
				if(data){
					self.collect(data);
				}else{
					next();
				}
			}
		}

		if(param instanceof Array){
			loadFeeds(param, nnn);
		}else if(typeof param == "string"){
			loadFeeds([param], nnn);
		}else{
			try{
				pipeToFeed(param, nnn);
			}catch(error){
				nnn(error);
			}
		}
	});
	return receipt;
}

function loadFeeds(list, callback){
	list.forEach(function(path){
		var req = request(path);
		req.on("error", function (error) {
			callback(error);
		});
		pipeToFeed(req, callback);
	});
}

function pipeToFeed(stream, callback){
	stream.pipe(new FeedParser())
		.on("error", function (error) {
			callback(error);
		})
		.on("readable", function() {
			var stream = this;
			var item;
			while (item = stream.read()) {
				callback(null, Article.create(item));
			}
		}).
		on("end", function(){
			callback(null, null);
		});
}

function urls(url){
	if(url instanceof Array){
		return url;
	}else if(typeof url == "string"){
		return [url];
	}else{
		return [];
	}
}