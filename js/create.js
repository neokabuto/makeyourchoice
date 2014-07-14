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
		
		lastcatid++;
	});
	
	$(".category .addoptionbtn").click( function(){
		//add category
		var newopt = $( "#sampleoption" ).clone(true).appendTo( $(this).parent().parent().parent().children(".optionsbox") ).slideDown(800);
		newopt.attr("id", "opt_" + lastoptid);
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
		$("#xmloutput").html("<code id=\"xmlcode\"></code>");
		$("#xmlcode").text(toXML());
	});
});

var listOptions = function () {
	var list = [];
	
	$(".option:not(#sampleoption)").each( function() {
		list.append($(this).attr("id"));
	});
	
	return list;
};

var updatePrereqs = function() {
	var prereqSelects = $("select.prereq");
	var opts = $(".option");
	
	$(prereqSelects).each(function (index, element){
		
		$(element).empty().append("<option>None Required</option>");
		
		$(opts).each(function (optindex, optelement){
			
		});
		
	});
}

var toXML = function() {
	var output = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><doc>";
	
	//write settings
	output += "<settings>";
	output += "<setting key=\"Title\">";
	output += $("#inputTitle").val();
	output += "</setting>";
	output += "<setting key=\"StartPoints\">";
	output += parseInt($("#inputPoints").val());
	output += "</setting>";
	output += "<setting key=\"HeaderImage\">";
	output += $("#inputHeader").val();
	output += "</setting>";
	output += "</settings>";
	
	
	//write categories
	var cats = $(".category:not(#samplecategory)");
	
	output += "<categories>";
	
	
	$(cats).each(function(index, element){
		output += "<category id=\""+ $(element).attr("id").substring(4) +"\">";
		
		output += "<name>";
		output += $(element).find("#inputTitle").val();
		output += "</name>";
		
		output += "<description>";
		output += $(element).find("#inputDescription").val();
		output += "</description>";
		
		output += "<image>";
		output += $(element).find("#inputHeader").val();
		output += "</image>";
		
		if($(element).find("#inputPrereq").val() !== "None Required"){
			output += "<prereq>";
			output += $(element).find("#inputPrereq").val();
			output += "</prereq>";
		}
		
		output += "<starthidden>";
		output += $(element).find("#inputStartHidden").val();
		output += "</starthidden>";
		
		output += "<maxchoices>";
		output += $(element).find("#inputMaxChoices").val();
		output += "</maxchoices>";
		
		//write options
		var opts = $(cats).find(".option");
		$(opts).each(function(oindex, oelement){
			output += "<option id=\""+ $(element).attr("id").substring(4) +"\">";
			output += "</option>";			
		});
		
		output += "</category>";
		
		});
	output += "</categories>";
	
	output += "</doc>";
	return output;
};