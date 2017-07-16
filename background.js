
//notifies just before an http request gets sent 
chrome.webRequest.onBeforeRequest.addListener(
        function(details){
        	console.log(details.url);

        	//getting current tab is required to send messages to content script
        	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
        		var activeTab = tabs[0];
			    chrome.tabs.sendMessage(activeTab.id, {
				    "message": true
			    });
		    });
        },
        // {urls: ["<all_urls>"]});
		{urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/*"]});
        // {urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/*"]});
        //this url is not recognized for some reason, but shortening it works. 