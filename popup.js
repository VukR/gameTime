chrome.storage.sync.get(function(result){
	for(var key in result){
		console.log("Key: " + key + " value: " + result[key]);
		var elem = document.createElement("p");
		elem.innerHTML = key;
		document.getElementById("results").appendChild(elem);
	}
});

document.addEventListener('DOMContentLoaded', function() {
	var emailValue
	// console.log("content loaded");
	document.getElementById("submit").onclick = function(){
		emailValue = document.getElementsByName("email")[0].value.trim();

		chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
			var activeTab = tabs[0];
		    chrome.tabs.sendMessage(activeTab.id, {"message": emailValue});
		});
	}
});