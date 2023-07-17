function createPopupBox(text) {
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);
    }

    const popupBox = document.createElement('div');
    popupBox.setAttribute('id', 'popupBox');

    const closeButton = document.createElement('div');
    closeButton.textContent = 'x';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '4px';
    closeButton.style.right = '4px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', removePopupBox);
    popupBox.appendChild(closeButton);

    const content = document.createElement('div');
    content.textContent = text;
    popupBox.appendChild(content);
    document.body.appendChild(popupBox);
}

function removePopupBox() {
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);
    }
}

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        let text = window.getSelection().toString().trim();

        if (text.length > 0) {
            createPopupBox(text);
            try {
                chrome.runtime.sendMessage({ action: 'showText', text: text });
            } catch {
                return
            }
        } else {
            removePopupBox();
        }
    }
});