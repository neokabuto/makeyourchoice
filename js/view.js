var startpoints = 0;

$(function(){
	
	//initialize
	//get URL from parameter
	var url = "";
	var parameters = window.location.search.substring(1).split('&');
	for (var i = 0; i < parameters.length; i++){
		if(parameters[i].indexOf("url=") != -1){
			url = parameters[i].substr(4);
		}
	}
	
	//make sure we have a url
	if(url === ""){
		//redirect back to home page
		window.location = "index.html";
	} else {
		//reject urls that are too short
		if(url.length < 5){
			window.location = "index.html";
		}
		
		var pastebinurl = "http://pastebin.com/raw.php?i=";
		
		if(url.indexOf(".") === -1){ //assume non-URLs are pastebin IDs
			pastebinurl += url;
		} else {
			if(url.indexOf("pastebin.com/") !== -1 && url.indexOf("raw.php") === -1){ //non-raw pastebin URL
				pastebinurl += url.substr(url.indexOf(".com/") + 5);
			} else {
				pastebinurl = url;
			}
		}
		
		//get XML file from URL
		var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + pastebinurl + '"') + '&format=xml&callback=cbFunc';
		
		$.ajax({ url : yql,
			datatype: "jsonp",
			jsonp: "cbFunc",
			jsonpCallback: cbFunc
		});
	}
});


var cbFunc = function(data){
	loadFromXML(data.results[0]);
}

var loadFromXML = function(xml){
	xml = xml.replace(/[\n|\t|\r]/g, "");
	xml = $.parseXML(xml);
	
	$(".container").show();
	
	$(xml).find("settings").find("setting").each(function(index, element) {
		switch($(element).attr("key")){
			case "Title":
				$("#title").html($(element).text());
				break;
			case "StartPoints":
				startpoints = $(element).text();
				break;
			case "HeaderImage":
				$("#headerimg").attr('src',$(element).text());
				$("#headerimg").show();
				break;
		}
	});
	
	
	var maxcatid = 0;
	var maxoptid = 0;
	
	//add categories
	$(xml).find("categories").find("category").each(function(index, element) {
	
	});
	
}