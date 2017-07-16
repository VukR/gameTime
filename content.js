
//todo, not use a global var
var courtsObj = {};
//chrome.storage.sync.clear();
chrome.storage.sync.get(null, function(result){
	console.log('start');
	console.log(result);
	courtsObj = result;
});

/*todo needs better way to wait for dynamic content to be loaded
user id on page is 1533, doesnt change on new login.*/
setTimeout(function(){
	// document.addEventListener("DOMSubtreeModified", function(){
	//    console.log("dom modified");
	// });
	var currentDate = new Date();
	console.log(currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" +
		currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + 
		currentDate.getMinutes() + ":" + currentDate.getSeconds());

	createBoxes();
}, 3000);

/*receive message from background that new date was picked, repopulate courts with 
check boxes. 
todo Find better way to wait for dynamic content to load instead of setTimeout*/
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
	console.log("received message");
	if (request.message){
		setTimeout(createBoxes, 3000);
	}
});

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

				var checkBox = document.createElement("input");
				checkBox.type = "checkbox";
				checkBox.id = activeDate + " Court " + (x + 1) + " Time " 
				+ firstChild.childNodes[0].innerHTML.trim();
				checkBox.className = "checkBox";
				//when box is clicked, update it in memory
				checkBox.onclick = function(){
					update(this.id);
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
function update(id){
	console.log("clicked: " + id);

	if(id in courtsObj){
		delete courtsObj[id];
		console.log("removed id");
	}

	else{
		courtsObj[id] = "reserved";
		console.log("save id");
	}

	sync();
}

//clear storage before updating with new object, otherwise bug where items are not removed
//todo find why bug happens
function sync(){
	chrome.storage.sync.clear();
	chrome.storage.sync.set(courtsObj, function(){
		// console.log("update storage");
	});
}