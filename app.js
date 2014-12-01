document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('html', function(data){
        if(typeof data !== 'undefined'){
            document.body.innerHTML = data.html;
        }
    });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    document.body.innerHTML = changes['html'].newValue;
});