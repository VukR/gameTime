chrome.storage.sync.get(function(result){
	//console.log(result)
	for(var key in result){
		console.log("Key: " + key + "value: " + result[key]);
		var elem = document.createElement("p");
		elem.innerHTML = result[key];
		document.getElementById("results").appendChild(elem);
	}
});