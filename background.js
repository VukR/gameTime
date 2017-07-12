
//notifies just before an http request gets sent 
chrome.webRequest.onBeforeRequest.addListener(
        function(details){
        	console.log(details.url);
        	var currentDate = new Date();
        	console.log(currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" +
				currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + 
				currentDate.getMinutes() + ":" + currentDate.getSeconds());
        },
        // {urls: ["<all_urls>"]});
		{urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/*"]});
        // {urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/*"]});
        //this url is not recognized for some reason, but shortening it works. 