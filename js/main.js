$(document).ready(function() {
	var converter = new Showdown.converter();
	$.ajax({
		method: "GET",
		dataType: "JSON",
		url: "https://api.github.com/repos/kriekapps/cantrip/contents/README.md"
	}).done(function(response) {
		$('.main').append(converter.makeHtml(window.atob(response.content)));
		$('pre').addClass('prettyprint');
		$('#cantrip').remove();

		prettyPrint();

	}).fail(function(xhr, err) {
		console.log(xhr, err);
	});
});