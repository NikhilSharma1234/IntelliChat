document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        var selectedText = window.getSelection().toString();
        
        chrome.runtime.sendMessage({ action: 'showText', selectedText: selectedText });
      }
  });