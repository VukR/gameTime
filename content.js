//todo, not use global variable for loading data out of memory
var courtsObj = {};
// chrome.storage.sync.clear();
chrome.storage.sync.get(null, function(result){
	console.log('start');
	console.log(result);
	courtsObj = result;
});

/*User id on page is 1533, doesnt change on new login.
Receive message from background that request for data has completed.
Poll for load of data*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
	console.log("received message");
	if (request.message == "complete"){
		var newLoad = setInterval(function(){
			console.log("newload setInterval");
			try{
				//remove checkboxes so on receive of message, multiple boxes are not placed
				removeBoxes();
				createBoxes();
				clearInterval(newLoad);
			}
			catch(undefined){
				console.log("not found");
			}

		}, 100);
	}

	else{
		// console.log(request.message);
		courtsObj["email"] = request.message;
		// console.log("receive email", courtsObj);
		sync();
	}
});

//remove checkBoxes
function removeBoxes(){
	var allBoxes = document.getElementsByClassName("checkBox");
	//console.log(allBoxes.length);
    while(allBoxes.length > 0){
        allBoxes[0].parentNode.removeChild(allBoxes[0]);
    }
}

//check type of court and place checkboxes
function createBoxes(){
	var courtColumn = document.querySelectorAll("td.timeslot");
	var activeDate = document.getElementsByClassName("active")[1]
	.getElementsByTagName("span")[0].innerHTML.trim();
	//console.log(activeDate);

	//for each court
	for(var x = 0; x < courtColumn.length; x++){
		var courts = courtColumn[x].querySelectorAll("div.timeslot");
		//for each time slot on each respective court
		for(var i = 0; i < courts.length; i++){
			var firstChild = courts[i].firstChild;

			//courts reserved by staff or by members
			if(firstChild.classList.contains("title") || 
				firstChild.classList.contains("timenotitle")){

				var time = firstChild.childNodes[0].innerHTML.trim();
				var court = x + 1;
				//creating the check box
				var checkBox = document.createElement("input");
				checkBox.type = "checkbox";
				checkBox.setAttribute("time", time);
				checkBox.setAttribute("court", court);
				checkBox.id = activeDate + " Court " + court + " Time " + time;
				checkBox.className = "checkBox";
				//when box is clicked, calls to update it in memory
				checkBox.onclick = function(){
					// update(this.id, firstChild.childNodes[0].innerHTML.trim(), (x+1));
					update(this.id, this.getAttribute("time"), this.getAttribute("court"));
				}
				//on each court append the check box
				courts[i].appendChild(checkBox);
			}
		}
	}
	populate();
}

//checkmark the boxes that are already in memory
function populate(){
	var checkBoxes = document.getElementsByClassName("checkBox");
	for(var x = 0; x < checkBoxes.length; x++){
		if(checkBoxes[x].id in courtsObj){
			console.log("matches");
			checkBoxes[x].checked = true;
		}
	}
}

//update object that will be saved in memory
function update(id, time, court){
	console.log("clicked: " + id);
	//console.log("Time: " + time + " court: " + court);
	var timeMinutes = convertTime(time);

	if(id in courtsObj){
		delete courtsObj[id];
		console.log("removed id");
	}

	else{
		courtsObj[id] = {t: timeMinutes, court: court};
		console.log("save id");
	}

	sync();
}

//convert court time to minutes
function convertTime(time){
	var minutes;

	if(time.indexOf("am") > -1){
		console.log("in am");
		var minutes = parseInt(time) * 60;
	}
	else{

		//noon
		if(time.indexOf("12") > -1){
			console.log("noon");
			var minutes = parseInt(time) * 60;
		}
		else{
			console.log("in pm");
			var minutes = (parseInt(time) * 60) + 720;
		}
	}
	console.log("time in minutes: " + minutes);
	return minutes;
}

//clear storage before updating with new object, otherwise bug where items are not removed
//todo find why bug happens
function sync(){
	chrome.storage.sync.clear();
	chrome.storage.sync.set(courtsObj, function(){
		console.log("updated storage");
		callServer(courtsObj);
	});
}

function callServer(stored){
	
	// this looks fine, but when sent to server, appears nested inside another object?
	var postString1 = JSON.stringify(stored);
	console.log(postString1);

	chrome.runtime.sendMessage({
		method: "POST",
		url: "http://localhost:8080/",
		data: postString1
	}, function(response){
		// console.log(response);
	});
}