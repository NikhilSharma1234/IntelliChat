chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showText') {
        console.log(request.text)
      }
});