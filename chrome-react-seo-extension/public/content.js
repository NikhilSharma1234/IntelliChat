document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        let text = window.getSelection().toString();
        const range = window.getSelection().getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const x = rect.right;
        const y = rect.bottom;

        chrome.runtime.sendMessage({ action: 'showText', text: text, x: x, y: y });
    }
});