//good for testing, but needs better way to wait for dynamic content to be loaded
setTimeout(function(){
	var courts = document.querySelectorAll("div.timeslot");
	//console.log(courts);

	/**get first child element of each timeslot div to check type of court availability and place 
	checkboxes for user to define what court they want to be notified for**/
	for(var i = 0; i < courts.length; i++){
		firstChild = courts[i].firstChild;

		//available courts
		if(firstChild.classList.contains("time")){
			console.log("time-booked: " + firstChild.innerHTML.trim());

			if(firstChild.style.backgroundColor == ""){
				console.log("color does not exist, court is open");
			}
		}

		//courts reserved by staff
		else if(firstChild.classList.contains("title")){
			console.log("time-booked: " + firstChild.childNodes[0].innerHTML.trim());
			console.log("Desc: " + firstChild.childNodes[1].innerHTML.trim());
			var checkBox = document.createElement("input");
			checkBox.type = "checkbox";
			checkBox.id = "box" + i;
			checkBox.className = "checkBox";
			courts[i].appendChild(checkBox);
		}

		//court reserved by members
		else if (firstChild.classList.contains("timenotitle")){
			console.log("booked court");
			var checkBox = document.createElement("input");
			checkBox.type = "checkbox";
			checkBox.id = "box" + i;
			checkBox.className = "checkBox";
			courts[i].appendChild(checkBox);
		}
	}

	//interval to get checkmarked boxes 
	setInterval(getResults, 2000);
}, 3000);

/**get check marked boxes and store user selected boxes 
locally using google sync storage**/
function getResults(){
	var boxes = document.getElementsByClassName("checkBox");
	console.log(boxes.length);
	for(var x = 0; x < boxes.length; x++){
		if(boxes[x].checked){
			console.log("checkbox " + boxes[x].id + " is checked");
			chrome.storage.sync.set({"value": boxes[x].id}, function(){
			});
		}
	}
	chrome.storage.sync.get(function(result){console.log(result)});
	console.log("Done");
}
