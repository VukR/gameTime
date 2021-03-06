//notifies after an http request has been succesfully completed 
chrome.webRequest.onCompleted.addListener(
    function(details){
        console.log(details.url);

    	//getting current tab is required to send messages to content script
    	chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
    		var activeTab = tabs[0];
		    chrome.tabs.sendMessage(activeTab.id, {
			    "message": "complete"
		    });
	    });
    },
    // {urls: ["<all_urls>"]});
	{urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/*"]}
    // {urls: ["http://scsctennis.gametime.net/scheduling/index/jsoncourtdata/sport/1/date/*"]});
    //this url is not recognized for some reason, but shortening it works. 
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse){
    var xhttp = new XMLHttpRequest();

    xhttp.onload = function(){
        var response = xhttp.responseText;

        sendResponse(response);
    };

    xhttp.open(request.method, request.url, true);
    console.log("in bg", request.data);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); // must set header for post request, must make sure data is serializable

    xhttp.send(request.data);
    return true;
});