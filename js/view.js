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
		
		var pastebinurl = "pastebin.com/raw.php?i=";
		
		if(url.indexOf(".") === -1){ //assume non-URLs are pastebin IDs
			pastebinurl += url;
		} else {
			if(url.indexOf("pastebin.com/") !== -1 && url.indexOf("raw.php") === -1){ //non-raw pastebin URL
				pastebinurl += url.substr(url.indexOf(".com/") + 5); // attempt to retrieve ID from the given URL
			} else {
				pastebinurl = url;
			}
		}
		
		// remove protocol for proxy
		if(pastebinurl.indexOf("://") !== -1){
			pastebinurl = pastebinurl.substr(pastebinurl.indexOf("://") + 3);
		}
		
		//get XML file from URL
		var proxyurl = "http://www.corsproxy.com/" + pastebinurl;
		$.get(proxyurl,loadFromXML);
	}
});

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
			case "IntroText":
				$("#introtext").html($(element).text());
				break;
		}
	});
	
	
	var maxcatid = 0;
	var maxoptid = 0;
	
	//add categories
	$(xml).find("categories").find("category").each(function(index, element) {
		var newcat = $( "#samplecategory" ).clone(true).hide().appendTo( "#categories" ).show();
		
		var catid = $(element).attr("id");
		$(newcat).attr("id", "cat" + "_" + catid);
		
		
		//set category settings
		$(element).children().each(function(sindex,selement) {
			switch($(selement)[0].nodeName){
				case "name":
					$(newcat).find(".cattitle").html($(selement).text());
					break;
				case "description":
					$(newcat).find(".catdesc").html($(selement).text());
					break;
				case "image":
					$(newcat).find(".catimg").attr('src',$(selement).text());
					$(newcat).find(".catimg").show();
					break;
				case "starthidden":
					if($(selement).text() == "true"){
						$(newcat).hide();
					}
					break;
				case "maxchoices":
					$(newcat).data("maxchoices", $(selement).text());
					break;
			}
		});
		
		//add options
		$(element).find("options").find("option").each(function(oindex, oelement) {
			var newopt = $( "#sampleoption" ).clone(true).appendTo( $(newcat).find(".options") );
			
			var optid = $(oelement).attr("id");
			$(newopt).attr("id", "opt" + "_" + optid);
			
			
			$(oelement).children().each(function(sindex,selement) {
				switch($(selement)[0].nodeName){
					case "name":
						$(newopt).find(".opttitle").html($(selement).text());
						break;
					case "cost":
						$(newopt).find(".value").html($(selement).text());
						break;
					case "description":
						$(newopt).find(".optdesc").html($(selement).text());
						break;
					case "image":
						$(newopt).find(".optimg").attr('src',$(selement).text());
						$(newopt).find(".optimg").show();
						break;
					case "starthidden":
						if($(selement).text() == "true"){
							$(newopt).hide();
						}
						break;
					case "specification":
						if($(selement).text() == "true"){
							$(newopt).find(".spec").show();
						}
						break;
					case "maxquantity":
						if($(selement).text() == "1"){
							$(newopt).find(".buymany").hide();
						} else {
							$(newopt).find(".buyone").hide();
						}
						break;
				}
			});
		});
		
		
	});
	
	$("#samplecategory").hide();
	$("#sampleoption").hide();
	
}