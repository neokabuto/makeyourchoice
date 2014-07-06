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
	});
});

var listOptions = function () {
	var list = [];
	
	$(".option:not(#sampleoption)").each( function() {
		list.append($(this).attr("id"));
	});
	
	return list;
};