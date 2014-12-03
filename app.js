/**
 * Listen popup load event
 */
document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get('html', function(data){
        if(typeof data.html !== 'undefined'){
            document.body.innerHTML = data.html;
        }
    });
});

/**
 * Listen local storage change and show result on popup
 */
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if(typeof changes['html'].newValue !== 'undefined'){
        document.body.innerHTML = changes['html'].newValue;
    }
});