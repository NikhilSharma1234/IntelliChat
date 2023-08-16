chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.action === 'showText') {
        console.log(request.text)
      }
    else if (request.action === 'getToken') {
      sendResponse({token: userToken});
    }
    else if (request.action === 'setTabId') {
      const tab = await getCurrentTab();
      extensionTabId = tab.id;
      return
    }
});

var contextMenuitem = {
  id: "spendMondey",
  title: "IntelliSearch on IntelliChat",
  contexts: ["selection"]
}

let userToken = '';

let extensionTabId = '';

chrome.runtime.onInstalled.addListener(async () => {
  const tab = await getCurrentTab();
  chrome.contextMenus.create(contextMenuitem);
  if (tab.url?.startsWith("chrome://")) return;
  console.log(tab)
  await chrome.scripting.insertCSS({
    files: ["style.css"],
    target: { tabId: tab.id },
  });
});

chrome.contextMenus.onClicked.addListener(async (item, tab) => {
  console.log(item);
})

chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  userToken = request.jwt;
  chrome.tabs.update(extensionTabId, {selected: true});
  sendResponse("OK")
})

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}