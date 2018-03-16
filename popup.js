chrome.storage.sync.get(function(result){
	for(var key in result){
		console.log("Key: " + key + " value: " + result[key]);
		var elem = document.createElement("p");

		if(key == "email"){
			// elem.innerHTML = "Current email to recieve notifications: "+ result[key];
			elem.innerHTML = "Current email to recieve notifications: "+ result[key];
			document.getElementById("email").appendChild(elem);

		}
		else{
			elem.innerHTML = key;
			document.getElementById("results").appendChild(elem);
		}
	}
});

document.addEventListener('DOMContentLoaded', function() {
	var emailValue
	// console.log("content loaded");
	document.getElementById("submit").onclick = function(){
		emailValue = document.getElementsByName("email")[0].value.trim();
		// document.getElementById("email").firstChild.innerHTML = emailValue;
		try{
			console.log(document.getElementById("email").firstElementChild.innerHTML = "Current email to recieve notifications: "+ emailValue);
		}
		catch(err){
		}

		if(emailValue == ""){
			alert("You must enter an email address before watchlisting courts!");
		}

		else{
			chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
				var activeTab = tabs[0];
			    chrome.tabs.sendMessage(activeTab.id, {"message": emailValue});
			});
		}
	}
});