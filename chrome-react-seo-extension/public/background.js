function createPopupBox(text, x, y) {
    const popupBox = document.createElement('div');
    popupBox.textContent = text;
    popupBox.classList.add('popup-box');
    popupBox.style.left = `${x}px`;
    popupBox.style.top = `${y}px`;
    document.body.appendChild(popupBox);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showText') {
      createPopupBox(request.text, request.x, request.y)
      console.log(request.text)
    }
});

