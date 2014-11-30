
var yifyChecker = {

    apiURL : "https://yts.re/api/listimdb.json?imdb_id=",

    run : function(imdb_id) {
        this.requestJSON(imdb_id);
    },

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

    showTorrents : function(data) {
        var bodyText = '';
        if(data.status === "fail"){
            bodyText += "No torrent found :(";
        } else {
            var count = data.MovieCount;
            for(var i = 0; i < count; i++) {
                var title = data.MovieList[i].MovieTitleClean + ' - ' + data.MovieList[i].Quality + ' (' + data.MovieList[i].Size + ')';
                bodyText += '<a href="'+data.MovieList[i].TorrentUrl+'" target="_blank">'+title+'</a>';
            }
        }
        chrome.storage.local.set({'html' : bodyText});
        var views = chrome.extension.getViews({type: "popup"});
        for (var i = 0; i < views.length; i++) {
            views[i].document.innerHTML = '';
        }
    }

};
chrome.webNavigation.onCompleted.addListener(function(details) {
    chrome.tabs.query({active:true}, function(selectedTab){
        var url = selectedTab[0].url.split('/');
        if((url[2] === 'imdb.com' || url[2] === 'www.imdb.com') && url[3] === 'title' && details.url === selectedTab[0].url){
            yifyChecker.run(url[4]);
        }
    });
});