$(document).ready(function() {
	var converter = new Showdown.converter();
	$.ajax({
		method: "GET",
		dataType: "JSON",
		url: "https://api.github.com/repos/kriekapps/cantrip/contents/README.md"
	}).done(function(response) {
		
		// Render data
		var id = getMyId();
		$('.main').append(converter.makeHtml(window.atob(response.content).replace(/randomID/g,id)));
		
		// Formatting
		$('pre').addClass('prettyprint');
		$('#cantrip').remove();
		prettyPrint();

		// set correct license url
		$('a[href="LICENSE"]').attr("href","https://raw.githubusercontent.com/kriekapps/cantrip/master/LICENSE").attr("target","_blank");

		//Add try buttons
		$(".prettyprint").each(function() {
			var innerText = $(this).text();
			if (innerText.indexOf("$ curl") > -1) {
				var footer = $("<div class='codeFooter'></div>");
				var button = $("<button class='tryit'>Try it out</button>");
				footer.append(button);
				$(this).after(footer);
				button.click(function() {
					displayDialog(parseCURL(innerText));
				});
			}
		});

	}).fail(function(xhr, err) {
		console.log(xhr, err);
	});


	$(".dialog .close, .cover").click(function() {
		$(".dialog, .cover").hide();
	});

	$(".dialog .submit").click(function() {
		$.ajax({
			method: $(".dialog button.active").data("method"),
			dataType: "JSON",
			url: $(".dialog .url").val(),
			data: $(".dialog .data").val(),
			contentType: "application/json"
		}).done(function(response) {
			$(".dialog .response").text(JSON.stringify(response, null, "\t"));
		}).fail(function(response) {
			$(".dialog .response").text(JSON.stringify(JSON.parse(response.responseText), null, "\t"));
		});
	});

	$(".dialog .methodButtons button").click(function() {
		$(".dialog .methodButtons button").removeClass("active");
		$(this).addClass("active");
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

function parseCURL(text) {
	var data = {
		method: "GET",
		url: "http://cantrip.kriekapps.com/avm81dfs9k9" + getMyId(),
		data: ""
	}
	var fragments = text.split("\\\n");
	for (var i = 0; i < fragments.length; i++) {
		var fragment = fragments[i].trim();
		if (fragment.indexOf("-X") > -1) {
			data.method = fragment.split(" ")[1];
		}
		else if (fragment.indexOf("-d") > -1) {
			data.data = fragment.replace("-d ", "").replace(/\'/g, "");
		}
		else {
			data.url = fragment.replace("$ curl ", "").replace(/\"/g, "");
		}
	}
	return data;
}

function displayDialog(data) {
	$(".dialog .url").val(data.url);
	$(".dialog .data").val(data.data);
	$(".dialog .methodButtons button").removeClass("active");
	$(".dialog .methodButtons button[data-method=" + data.method + "]").addClass("active");
	$(".dialog .response").text("");
	$(".dialog, .cover").show();
	$(".dialog").css({
		top: window.scrollY + 100
	});
}