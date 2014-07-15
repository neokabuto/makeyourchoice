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
	
});

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
		output += $(element).find("#inputStartHidden").val();
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
			output += $(oelement).find("#inputStartHidden").val();
			output += "\n\t\t\t\t</starthidden>\n";
			
			output += "\t\t\t\t<specification>\n\t\t\t\t\t";
			output += $(oelement).find("#inputSpec").val();
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