function getJSON(request, callback) {

	httpRequest.open("GET", request, true);
	httpRequest.send();

	httpRequest.onreadystatechange  = function() {
		if (httpRequest.readyState === 4 && httpRequest.status === 200 ) {
			callback(JSON.parse(httpRequest.responseText));
		}
	}
}