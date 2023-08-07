function removePopupBox(text) {
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);

        const elements = ['define', 'learn', 'summarize'];
        for (const elementId of elements) {
            const elem = document.getElementById(elementId);
            if (elem) {
                elem.removeEventListener('click', () => updateChat(elementId, text));
            }
        }
    }
}

function scrollToBottom() {
    const popupWindow = document.getElementById('popupWindow');
    const lastChild = popupWindow.lastElementChild;

    if (lastChild) {
        lastChild.scrollIntoView({ behavior: 'smooth' });
    }
}

async function createPopupBox(text) {
    
    const existingPopupBox = document.getElementById('popupBox');

    if (existingPopupBox) {
        existingPopupBox.parentNode.removeChild(existingPopupBox);
    }
    
    const popupBox = document.createElement('div');
    popupBox.setAttribute('id', 'popupBox');

    fetch(chrome.runtime.getURL('/popup.html'))
    .then(r => r.text())
    .then(html => {
        popupBox.insertAdjacentHTML('beforeend', html);

        const buttonsWrapper = popupBox.querySelector('#buttonsWrapper');
        if (buttonsWrapper) {
            const defineButton = buttonsWrapper.querySelector('#define');
            const summarizeButton = buttonsWrapper.querySelector('#summarize');
            const learnMoreButton = buttonsWrapper.querySelector('#learn');
            defineButton.textContent = chrome.i18n.getMessage("define");
            summarizeButton.textContent = chrome.i18n.getMessage("summarize");
            learnMoreButton.textContent = chrome.i18n.getMessage("learn");

            let halfText;
            if (text.length > 20) {
                halfText = 'Selected: ' + text.slice(0, 20) + '...';
            } else {
                halfText = 'Selected: ' + text;
            }

            const popupWindow = document.getElementById('popupWindow');
            popupWindow.insertAdjacentHTML('afterend', `<div class="font-bold opacity-50 mb-[-4vh]">${halfText}</div>`);
            defineButton?.addEventListener('click', () => updateChat('define', text));
            summarizeButton?.addEventListener('click', () => updateChat('summarize', text));
            learnMoreButton?.addEventListener('click', () => updateChat('learn', text));
        }
    });
    
    document.body.appendChild(popupBox);
}

async function fetchTextResponse(query) {
    const url = `https://justcors.com/tl_eee537b/https://xse8e5ol9f.execute-api.us-east-1.amazonaws.com/prod?query=${encodeURIComponent(query)}`;
    const apiKey = 'GzLblsURP52KBi11r2JDq65V98RyjKbZ6Hu0j4Cn'; // eventually change to something more secure...
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
    const lang = chrome.i18n.getUILanguage();
    const popupWindow = document.getElementById('popupWindow');
    let translated_event = chrome.i18n.getMessage(event)
    const capitalizedEvent = translated_event.charAt(0).toUpperCase() + translated_event.slice(1)
    if (popupWindow.classList.contains('hidden')) {
        popupWindow.classList.remove('hidden'); // Remove hidden class, now that there are messages.
    }
    popupWindow.insertAdjacentHTML('beforeend', `<div class="chat-item chat-item-left"><div class="font-xs chat-bubble chat-bubble-blue rounded-lg p-2">${capitalizedEvent}</div></div>`);
    scrollToBottom();
    let text_response;
    switch (event) {
        case 'define':
            text_response = await fetchTextResponse(`What does this mean: ${text}?}`);
            break;
        case 'summarize':
            text_response = await fetchTextResponse(`Summarize this: ${text}.`);
            break;
        case 'learn':
            text_response = await fetchTextResponse(`Give me links regards this: ${text}?`);
            break;
        default:
            throw "err"
    }
    
    if (text_response) {
        popupWindow.insertAdjacentHTML('beforeend', `<div class="chat-item chat-item-right"><div class="font-xs chat-bubble chat-bubble-gray rounded-lg p-2">${text_response}</div></div>`);
    } else {
        popupWindow.insertAdjacentHTML('beforeend', `<div class="chat-item chat-item-right"><div class="font-xs chat-bubble chat-bubble-gray rounded-lg p-2">${chrome.i18n.getMessage("error")}</div></div>`);
    }
    scrollToBottom();
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