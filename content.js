//good for testing, but needs better way to wait for dynamic content to be loaded
setTimeout(function(){

	chrome.storage.sync.clear();
	var courtColumn = document.querySelectorAll("td.timeslot");
	var activeDate = document.getElementsByClassName("active")[1]
	.getElementsByTagName("span")[0].innerHTML.trim();
	//console.log(activeDate);


	/**get first child element of each timeslot div to check type of court availability and place 
	checkboxes for user to define what court they want to be notified for**/
	for(var x = 0; x < courtColumn.length; x++){
		//console.log(courtColumn[x]);
		var courts = courtColumn[x].querySelectorAll("div.timeslot");
		for(var i = 0; i < courts.length; i++){
			firstChild = courts[i].firstChild;
			//console.log(firstChild);

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
				//checkBox.id = "box" + i;
				checkBox.id = activeDate + " Court " + (x + 1) + " Time " 
				+ firstChild.childNodes[0].innerHTML.trim();
				checkBox.className = "checkBox";
				courts[i].appendChild(checkBox);
			}

			//court reserved by members
			else if (firstChild.classList.contains("timenotitle")){
				console.log("booked court");
				var checkBox = document.createElement("input");
				checkBox.type = "checkbox";
				//checkBox.id = "box" + i;
				checkBox.id = activeDate + " Court " + (x + 1) + " Time " 
				+ firstChild.childNodes[0].innerHTML.trim();
				checkBox.className = "checkBox";
				courts[i].appendChild(checkBox);
			}
		}
	}

	//interval to get checkmarked boxes 
	setInterval(getResults, 2000);
}, 3000);

/**get check marked boxes and store user selected boxes 
locally using google sync storage**/
function getResults(){
	var checkedArray = [];
	var courtColumn = document.querySelectorAll("td.timeslot");

	for(var x = 0; x < courtColumn.length; x++){
		var boxes = courtColumn[x].getElementsByClassName("checkBox");
		for(var y = 0; y < boxes.length; y++){
			if(boxes[y].checked){
				checkedArray.push(boxes[y].id)
				console.log("box checked");
				//console.log("checkbox " + boxes[x].id + " is checked"); 
				// chrome.storage.sync.set({"value": boxes[y].id}, function(){
				// });
			}
		}
	}

	courtsObj = {};
	for(var i = 0; i < checkedArray.length; i++){
		courtsObj[i] = checkedArray[i];
	}
	
	chrome.storage.sync.set(courtsObj, function(){});
	chrome.storage.sync.get(function(result){console.log(result)});
	console.log("Done");
}
