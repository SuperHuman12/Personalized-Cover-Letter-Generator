const crypto = self.crypto || self.msCrypto;

const nonce = crypto.getRandomValues(new Uint8Array(16)).join('');

let popupPort;

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === 'popup') {
    popupPort = port;

    port.onDisconnect.addListener(function() {
      popupPort = null;
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getNonce") {
        sendResponse({ nonce: nonce });
    }
    // Add more event handlers here if needed
});

// Code added below

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "generate") {
        // Your logic to make a request to your server and generate the cover letter
        // ...

        // Once your cover letter is generated, send a response to the popup like this:
        // chrome.runtime.sendMessage({ result: "Generated cover letter text" });
    }
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        id: "generateCoverLetter", // Unique ID
        title: "Generate Personalized Cover Letter",
        contexts: ["all"]
    });
});

// Add onClicked event listener
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "generateCoverLetter") {
        // Open the extension's page
        chrome.tabs.create({url: "popup.html"});
    }
});
