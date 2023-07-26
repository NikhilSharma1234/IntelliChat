function removePopupBox(text) {
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);

        const elements = ['define', 'learnmore', 'summarize'];
        for (const elementId of elements) {
            const elem = document.getElementById(elementId);
            elem.removeEventListener('click', () => updateChat(elementId, text));
        }
    }
}

async function createPopupBox(text) {
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);
    }

    const popupBox = document.createElement('div');
    popupBox.setAttribute('id', 'popupBox');
    
    fetch(chrome.runtime.getURL('/popup.html')).then(r => r.text()).then(html => {
        popupBox.insertAdjacentHTML('beforeend', html);
    });
    
    const elements = ['define', 'learnmore', 'summarize'];

    for (const elementId of elements) {
        const elem = document.getElementById(elementId);
        elem.addEventListener('click', () => updateChat(elementId, text));
    }


    document.body.appendChild(popupBox);
}

async function fetchTextResponse(query) {
    const url = `https://justcors.com/tl_cf47154/https://xse8e5ol9f.execute-api.us-east-1.amazonaws.com/prod?query=${encodeURIComponent(query)}`;
    const apiKey = 'MXEbAK9Js81dzRGHKnJVd6rmmJqTADyv4OiARqoG'; // eventually change to something more secure...
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'x-api-key': apiKey,
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      
      const text_response = await response.json();
      return text_response;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
}  

async function updateChat(event, text) {
    const popupBox = document.getElementById('popupBox');
    switch (event) {
        case 'define':
            text_response = await fetchTextResponse(`What does this mean: ${text}`);
            popupBox.insertAdjacentHTML('afterbegin', `<div>${text_response}<div/>`);
            break;
        case 'summarize':
            text_response = await fetchTextResponse(`Summarize this: ${text}`);
            popupBox.insertAdjacentHTML('afterbegin', `<div>${text_response}<div/>`);
            break;
        case 'learnmore':
            text_response = await fetchTextResponse(`What does this mean: ${text}`);
            popupBox.insertAdjacentHTML('afterbegin', `<div>${text_response}<div/>`);
            break;
        default:
            throw "err"
    }
}

document.addEventListener('keydown', async function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'X') {
        let text = window.getSelection().toString().trim();
    
        if (text.length > 0) {
            await createPopupBox(text);
            try {
                chrome.runtime.sendMessage({ action: 'showText', text: text });
            } catch {
                return
            }
        } else {
            removePopupBox(text);
        }
    }
});