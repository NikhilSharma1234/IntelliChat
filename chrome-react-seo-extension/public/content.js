function createPopupBox(text) {
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);
    }

    const popupBox = document.createElement('div');
    popupBox.setAttribute('id', 'popupBox');

    // Logo
    const logo = document.createElement('img');
    logo.setAttribute('id', 'loader-logo');
    logo.src = chrome.runtime.getURL("images/intelli_dark_transparent.png");

    // Loader
    const loader = document.createElement('div');
    loader.setAttribute('id', 'html-spinner');

    // Close Button
    const closeButtonOuter = document.createElement('div');
    closeButtonOuter.setAttribute('class', 'outer');
    const closeButtonInner = document.createElement('div');
    closeButtonInner.setAttribute('class', 'inner');
    const label = document.createElement('LABEL');
    label.textContent = 'Close' 
    closeButtonInner.appendChild(label);
    closeButtonOuter.appendChild(closeButtonInner);

    closeButtonOuter.addEventListener('click', removePopupBox);
    popupBox.appendChild(closeButtonOuter);


    popupBox.appendChild(logo);
    popupBox.appendChild(loader);
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