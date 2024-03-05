$(".gauche").click(function(){
	$(this).parent().parent().hide();
	$(this).parent().parent().prev().show();
});
$(".droite").click(function(){
	$(this).parent().parent().hide();
	$(this).parent().parent().next().show();
});

$(".droite").each(function(){
	if(!$(this).parent().parent().next().hasClass("semaine")){
		$(this).hide();
	}
});

$(".gauche").each(function(){
	if(!$(this).parent().parent().prev().hasClass("semaine")){
		$(this).hide();
	}
});

if($(".semaine.active").length == 0){
	var d = new Date();
	month = '' + (d.getMonth() + 1);
    day = '' + d.getDate();
    year = d.getFullYear();
	if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
	aujourdhui = [year, month, day].join('-');
	trouve = false;
	$(".semaine").each(function(){
		console.log($(this).attr("ds") + " / " + aujourdhui);
		if($(this).attr("ds") >= aujourdhui && !trouve){
			trouve = true;
			$(this).addClass("active");
		}
	});
	if(trouve == false){
		$(".semaine").last().addClass("active");
	}
}