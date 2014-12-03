/**
 * Class that fetches and shows yify data
 */
var yifyChecker = {

    apiURL : "https://yts.re/api/listimdb.json?imdb_id=",

    run : function(imdb_id) {
        this.requestJSON(imdb_id);
    },

    /**
     * Fetches json result for the specified movie
     */
    requestJSON : function(imdb_id) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.apiURL + imdb_id, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                var resp = JSON.parse(xhr.responseText);
                yifyChecker.showTorrents(resp);
            }
        };
        xhr.send();
    },

    /**
     * Shows and saves the html result
     */
    showTorrents : function(data) {
        var bodyText = '';
        if(data.status === "fail"){
            bodyText += "No torrent found :(";
            // remove badge
            chrome.browserAction.setBadgeText({text:""});
        } else {
            var count = data.MovieCount;
            // build link
            for(var i = 0; i < count; i++) {
                var title = data.MovieList[i].MovieTitleClean + ' - ' + data.MovieList[i].Quality + ' (' + data.MovieList[i].Size + ')';
                bodyText += '<a href="'+data.MovieList[i].TorrentUrl+'" target="_blank">'+title+'</a>';
            }
            // set badge count
            chrome.browserAction.setBadgeBackgroundColor({color:[204, 0, 0, 230]});
            chrome.browserAction.setBadgeText({text:count+""});
        }
        // save the value into local storage to user in popup
        chrome.storage.local.set({'html' : bodyText});
        var views = chrome.extension.getViews({type: "popup"});
        for (var i = 0; i < views.length; i++) {
            views[i].document.innerHTML = '';
            // write the result to popup just in case
            views[i].document.innerHTML = bodyText;
        }
    }

};

/**
 * Listen page load event and run checker
 */
chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.query({active:true}, function(selectedTab){
        var url = selectedTab[0].url.split('/');
        // run only for imdb movie pages
        if((url[2] === 'imdb.com' || url[2] === 'www.imdb.com') && url[3] === 'title' && details.url === selectedTab[0].url){
            yifyChecker.run(url[4]);
        }
    });
});