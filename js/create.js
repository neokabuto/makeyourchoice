var lastcatid = 0;
var lastoptid = 0;

$(function(){
	
	//initialize
	$("#samplecategory").hide();
	$("#sampleoption").hide();
	$("#xmloutput").hide();
	
	$("#addcatbtn").click( function(){
		//add category
		var newcat = $( "#samplecategory" ).clone(true).hide().appendTo( "#categories" ).slideDown(800);
		newcat.attr("id", "cat"+ "_"+lastcatid);
		updatePrereqs();
		lastcatid++;
	});
	
	$(".category .addoptionbtn").click( function(){
		//add category
		var newopt = $( "#sampleoption" ).clone(true).appendTo( $(this).parent().parent().parent().children(".optionsbox") ).slideDown(800);
		newopt.attr("id", "opt_" + lastoptid);
		updatePrereqs();
		lastoptid++;
	});
	
	$(".category > .close").click( function(){
		//delete category
		$(this).parent().slideUp(500, function(){
			//delete it
			$(this).remove();
		});
	});
	
	$(".option > .close").click( function(){
		//delete option
		$(this).parent().slideUp(500, function(){
			//delete it
			$(this).remove();
		});
	});
	
	$("#exportbtn").click( function(){
		//create XML output
		$("#xmloutput").slideDown();
		$("#xmloutput").html("<pre id=\"xmlcode\" style=\"overflow-y: scroll; max-height: 500px;\"></pre>");
		$("#xmlcode").text(toXML());
	});
	
	$(".option input").change(updatePrereqs);
	
	$("#loadfrompastebin").click( function(){
		var pasteinput = $("#pastebinurl").val();
		
		var pastebinurl = "http://www.pastebin.com/raw.php?i=";
		
		if(pasteinput.indexOf("pastebin.com/raw.php?i=") !== -1){
			pastebinurl += pasteinput.substr(pasteinput.indexOf("pastebin.com/raw.php?i=") + "pastebin.com/raw.php?i=".length);
		} else {
			pastebinurl += pasteinput;
		}
		
		pastebinurl = "http://pastebin.com/raw.php?i=2yht3FHq";
		
		var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + pastebinurl + '"') + '&format=xml&callback=cbFunc';
		
		$.ajax({ url : yql,
			datatype: "jsonp",
			jsonp: "cbFunc",
			jsonpCallback: cbFunc
		});
	});
});

var cbFunc = function(data){
	loadFromXML(data.results[0]);
}

var listOptions = function () {
	var list = [];
	
	$(".option:not(#sampleoption)").each( function() {
		list.append($(this).attr("id"));
	});
	
	return list;
};

var updatePrereqs = function() {
	var prereqSelects = $(".category:not(#samplecategory) select.prereq");
	var opts = $(".option:not(#sampleoption)");
	
	$(prereqSelects).each(function (index, element){
		var existingval = $(element).val();
		
		$(element).empty().append("<option>None Required</option>");
		
		$(opts).each(function (optindex, optelement){
			var id = $(optelement).attr("id").substring(4);
			var name =  $(optelement).find("#inputTitle").val();
			
			$(element).append($("<option></option>")
     .attr("value", id).text(id + " - " + name));
		});
		
		$(element).val(existingval);
		
	});
}

var toXML = function() {
	var output = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<doc>\n";
	
	//write settings
	output += "\t<settings>\n";
	output += "\t\t<setting key=\"Title\">\n\t\t\t";
	output += $("#inputTitle").val();
	output += "\n\t\t</setting>\n";
	output += "\t\t<setting key=\"StartPoints\">\n\t\t\t";
	output += parseInt($("#inputPoints").val());
	output += "\n\t\t</setting>\n";
	output += "\t\t<setting key=\"HeaderImage\">\n\t\t\t";
	output += $("#inputHeader").val();
	output += "\n\t\t</setting>\n";
	output += "\t</settings>\n";
	
	
	//write categories
	var cats = $(".category:not(#samplecategory)");
	
	output += "\t<categories>\n";
	
	
	$(cats).each(function(index, element){
		output += "\t\t<category id=\""+ $(element).attr("id").substring(4) +"\">\n";
		
		output += "\t\t\t<name>\n\t\t\t\t";
		output += $(element).find("#inputTitle").val();
		output += "\n\t\t\t</name>\n";
		
		output += "\t\t\t<description>\n\t\t\t\t";
		output += $(element).find("#inputDescription").val();
		output += "\n\t\t\t</description>\n";
		
		output += "\t\t\t<image>\n\t\t\t\t";
		output += $(element).find("#inputHeader").val();
		output += "\n\t\t\t</image>\n";
		
		if($(element).find("#inputPrereq").val() !== "None Required"){
			output += "\t\t\t<prereq>\n\t\t\t\t";
			output += $(element).find("#inputPrereq").val();
			output += "\n\t\t\t</prereq>\n";
		}
		
		output += "\t\t\t<starthidden>\n\t\t\t\t";
		output += $(element).find("#inputStartHidden").prop('checked');
		output += "\n\t\t\t</starthidden>\n";
		
		output += "\t\t\t<maxchoices>\n\t\t\t\t";
		output += $(element).find("#inputMaxChoices").val();
		output += "\n\t\t\t</maxchoices>\n";
		
		//write options
		output += "\t\t\t<options>\n";
		
		var opts = $(cats).find(".option");
		$(opts).each(function(oindex, oelement){
			output += "\t\t\t\t<option id=\""+ $(oelement).attr("id").substring(4) +"\">\n";
			
					
			output += "\t\t\t\t<name>\n\t\t\t\t\t";
			output += $(oelement).find("#inputTitle").val();
			output += "\n\t\t\t\t</name>\n";
			
			output += "\t\t\t\t<description>\n\t\t\t\t\t";
			output += $(oelement).find("#inputDescription").val();
			output += "\n\t\t\t\t</description>\n";
			
			output += "\t\t\t\t<image>\n\t\t\t\t\t";
			output += $(oelement).find("#inputHeader").val();
			output += "\n\t\t\t\t</image>\n";
		
			output += "\t\t\t\t<cost>\n\t\t\t\t\t";
			output += $(oelement).find("#inputCost").val();
			output += "\n\t\t\t\t</cost>\n";
		
			if($(oelement).find("#inputPrereq").val() !== "None Required"){
				output += "\t\t\t\t<prereq>\n\t\t\t\t\t";
				output += $(oelement).find("#inputPrereq").val();
				output += "\n\t\t\t\t</prereq>\n";
			}
			
			output += "\t\t\t\t<starthidden>\n\t\t\t\t\t";
			output += $(oelement).find("#inputStartHidden").prop('checked');
			output += "\n\t\t\t\t</starthidden>\n";
			
			output += "\t\t\t\t<specification>\n\t\t\t\t\t";
			output += $(oelement).find("#inputSpec").prop('checked');
			output += "\n\t\t\t\t</specification>\n";
			
			output += "\t\t\t\t<maxquantity>\n\t\t\t\t\t";
			output += $(oelement).find("#inputMaxQuantity").val();
			output += "\n\t\t\t\t</maxquantity>\n";
			
			output += "\t\t\t\t</option>\n";			
		});
		
		output += "\t\t\t</options>\n";
		
		output += "\t\t</category>\n";
		
		});
	output += "\t</categories>\n";
	
	output += "</doc>";
	return output;
};

var loadFromXML = function(xml){
	xml = xml.replace(/[\n|\t|\r]/g, "");
	xml = $.parseXML(xml);
	
	//clear existing
	$("#settings input").val("");
	$(".category:not(#samplecategory)").remove();
	
	$(xml).find("settings").find("setting").each(function(index, element) {
		switch($(element).attr("key")){
			case "Title":
				$("#settings #inputTitle").val($(element).text());
				break;
			case "StartPoints":
				$("#settings #inputPoints").val($(element).text());
				break;
			case "HeaderImage":
				$("#settings #inputHeader").val($(element).text());
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
		
		if(catid > maxcatid){
			maxcatid = catid;	
		}
		
		//set category settings
		$(element).children().each(function(sindex,selement) {
			switch($(selement)[0].nodeName){
				case "name":
					$(newcat).find("#inputTitle").val($(selement).text());
					break;
				case "description":
					$(newcat).find("#inputDescription").val($(selement).text());
					break;
				case "image":
					$(newcat).find("#inputHeader").val($(selement).text());
					break;
				case "starthidden":
					if($(selement).text() == "true"){
						$(newcat).find("#inputStartHidden").prop('checked', true);
					}
					break;
				case "maxchoices":
					$(newcat).find("#inputMaxChoices").val($(selement).text());
					break;
			}
		});
		
		//add options
		$(element).find("options").find("option").each(function(oindex, oelement) {
			var newopt = $( "#sampleoption" ).clone(true).appendTo( $(newcat).find(".optionsbox") ).slideDown(800);
			
			var optid = $(oelement).attr("id");
			$(newopt).attr("id", "opt_" + optid);
			
			if(optid > maxoptid){
				maxoptid = optid;	
			}
			
			//option settings
			$(oelement).children().each(function(sindex,selement) {
				switch($(selement)[0].nodeName){
					case "name":
						$(newopt).find("#inputTitle").val($(selement).text());
						break;
					case "cost":
						$(newopt).find("#inputCost").val($(selement).text());
						break;
					case "description":
						$(newopt).find("#inputDescription").val($(selement).text());
						break;
					case "image":
						$(newopt).find("#inputHeader").val($(selement).text());
						break;
					case "starthidden":
						if($(selement).text() == "true"){
							$(newopt).find("#inputStartHidden").prop('checked', true);
						}
						break;
					case "specification":
						if($(selement).text() == "true"){
							$(newopt).find("#inputSpec").prop('checked', true);
						}
						break;
					case "maxquantity":
						$(newopt).find("#inputMaxQuantity").val($(selement).text());
						break;
					}
				});
			
			updatePrereqs();
			lastoptid++;
		});
		
	});
	
	//pass through again for prereqs
	
	//update maximum ids
	lastcatid = maxcatid;
	lastoptid = maxoptid;
};