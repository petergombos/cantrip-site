$(document).ready(function() {
	var converter = new Showdown.converter();
	$.ajax({
		method: "GET",
		dataType: "JSON",
		url: "https://api.github.com/repos/kriekapps/cantrip/contents/README.md"
	}).done(function(response) {
		
		$('.main').append(converter.makeHtml(window.atob(response.content).replace(/randomID/g,getMyId())));
		$('pre').addClass('prettyprint');
		$('#cantrip').remove();

		prettyPrint();

	}).fail(function(xhr, err) {
		console.log(xhr, err);
	});
});

function getMyId(){
	var id = "";
	if (Modernizr.localstorage) {
		id = localStorage.getItem("cantripId") || Math.random().toString(36).substring(7);
		localStorage.setItem("cantripId", id);
	} else {
		id = Math.random().toString(36).substring(7);
	}

	return id;
}