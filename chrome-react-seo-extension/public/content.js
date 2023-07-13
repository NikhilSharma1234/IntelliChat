function createPopupBox(text, x, y) {
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

    popupBox.style.position = 'fixed';
    popupBox.style.top = `${y}px`;
    popupBox.style.left = `${x}px`;
    popupBox.style.backgroundColor = 'white';
    popupBox.style.border = '4px solid black';
    popupBox.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.5)';
    popupBox.style.zIndex = '9999';
    document.body.appendChild(popupBox);
}

function removePopupBox() {
  if (popupBox) {
    popupBox.parentNode.removeChild(popupBox);
    popupBox = null;
  }
}

window.addEventListener('scroll', updatePopupBoxPosition);

function updatePopupBoxPosition() {
    const popupBox = document.getElementById('popupBox');

    if (popupBox) {
        const boundingRect = popupBox.getBoundingClientRect();
        const scrolledX = boundingRect.left + window.scrollX;
        const scrolledY = boundingRect.top + window.scrollY;
        popupBox.style.left = `${scrolledX}px`;
        popupBox.style.top = `${scrolledY}px`;
    }
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
            const lastRangeIndex = window.getSelection().rangeCount - 1;
            const lastRange = window.getSelection().getRangeAt(lastRangeIndex);
            const rect = lastRange.getBoundingClientRect();
            const x = rect.left;
            const y = rect.bottom;

            createPopupBox(text, x, y);
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