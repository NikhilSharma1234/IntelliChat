chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showText') {
        console.log(request.text)
      }
});

var contextMenuitem = {
  id: "spendMondey",
  title: "IntelliSearch on IntelliChat",
  contexts: ["selection"]
}

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

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}