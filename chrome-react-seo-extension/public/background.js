chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showText') {
      var selectedText = request.selectedText;
      console.log(selectedText)
    }
});