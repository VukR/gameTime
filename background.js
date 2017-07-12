
//notifies just before an http request gets sent 
chrome.webRequest.onBeforeRequest.addListener(
        function(details){
        	console.log(details.url);
        	var currentDate = new Date();
        	console.log(currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" +
				currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + 
				currentDate.getMinutes() + ":" + currentDate.getSeconds());

        	//getting current tab is required to send messages to content script
        	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        		var activeTab = tabs[0];
			    chrome.tabs.sendMessage(activeTab.id, {
				    "message": true
			    });
		    });
        	// chrome.runtime.sendMessage({
        	// 	message: true
        	// });
        },
        // {urls: ["<all_urls>"]});
		{urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/*"]});
        // {urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/*"]});
        //this url is not recognized for some reason, but shortening it works. 